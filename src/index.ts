#!/usr/bin/env node

import fs from 'fs';
import { $, createClient } from 'edgedb';
import prettier from 'prettier';
import toml from 'toml';
import { exec } from 'child_process';
import os from 'os';

const args = process.argv.slice(2);

let overrideOnly = false;
if (args.includes('--override-only')) {
	overrideOnly = true;
}

if (!overrideOnly) {
	exec(`npx @edgedb/generate interfaces > ${os.devNull}`, (err) => {
		if (err) {
			throw err;
		}
	});
}

const client = createClient();

if (!fs.existsSync('edgedb.toml')) {
	throw new Error('edgedb.toml not found');
}

let configFile = toml.parse(fs.readFileSync('edgedb.toml', 'utf8'));

let config = {
	module: 'EDGEDB_JSON',
	annotation: 'JSON_TYPE'
};

if (!configFile['edgedb-json']) {
	console.log('edgedb-json not found in edgedb.toml. Using default config.');
} else {
	config = { ...config, ...configFile['edgedb-json'] };
}

let importList: string[] = [];
let typeString = `\n\nimport type { Simplify, SetRequired } from 'type-fest'\n;
type Override<T, R> = Omit<T, keyof R> & R;\n\n`;
let overrideFunctionString = '';
let importString = '';

function createImportString(target: string) {
	return `import type { ${target} } from './interfaces';`;
}

const annnotatedModules: {
	[module: string]: {
		[type: string]: {
			[property: string]: {
				value: string;
				isLink: boolean;
				required: boolean;
			};
		};
	};
} = {};

const allModules: {
	[module: string]: {
		[type: string]: {
			[property: string]: {
				required: boolean;
			};
		};
	};
} = {};

function createOverrideFunction(module: string, property: string, value: string, isLink: boolean) {
	const { mod, name } = $.util.splitName(module);
	const target = $.util.splitName(value);

	const isSameModule = mod === target.mod;
	const isTargetDefaultModule = target.mod === 'default';
	const isOwnerDefaultModule = mod === 'default';
	const hasJson = annnotatedModules[target.mod] && annnotatedModules[target.mod][target.name];
	const targetRequired = allModules[mod][name][property].required;

	// add module to import list
	if (isTargetDefaultModule) {
		importList.push(target.name);
	} else {
		importList.push(`${target.mod} as _${target.mod}`);
	}
	if (isOwnerDefaultModule) {
		importList.push(name);
	} else {
		importList.push(`${mod} as _${mod}`);
	}
	if (isSameModule && !isTargetDefaultModule && !isOwnerDefaultModule) {
		importList.push(`${target.mod} as _${target.mod}`);
	}

	// create type for nested properties
	const prefix = `${hasJson ? `${isTargetDefaultModule ? '' : `${target.mod}_A_`}` : `${isTargetDefaultModule ? '' : `_${target.mod}.`}`}`;
	typeString += `\ntype ${isOwnerDefaultModule ? '' : mod + '_'}A_${name} = Simplify<Override<
			${isOwnerDefaultModule ? '' : '_' + mod + '.'}${name},
				{
					${property}${targetRequired ? '' : '?'}: Simplify<${prefix}${target.name}>${isLink ? '[]' : ''};
				}
			>>;\n`;

	// create override function
	let output = `
	type T_${name} = SetRequired<Partial<${isOwnerDefaultModule ? '' : `_${mod}.`}${name}>, "${property}">;
	export function override_${name}_${property}<${name} extends T_${name} | T_${name}[]>(_${name}: ${name}): ${name} extends Array<infer U>
		? Simplify<
				Override<
					U,
					{
						${property}: Simplify<${isTargetDefaultModule ? '' : target.mod + '_'}${hasJson ? 'A_' : ''}${target.name}>${isLink ? '[]' : ''};
					}
				>
		>[]
		: Simplify<
				Override<
					${name},
					{
						${property}: Simplify<${isTargetDefaultModule ? '' : target.mod + '_'}${hasJson ? 'A_' : ''}${target.name}>${isLink ? '[]' : ''};
					}
				>
		> {
		// @ts-ignore
		return _${name};
	}\n`;
	return output;
}
(async () => {
	const queryString =
		'with module schema select ObjectType {name,abstract,bases: { name },ancestors: { name },annotations: { name, @value },links: {name,cardinality,required,target: { name },},properties: {name,annotations: { name, @value },cardinality,required,target: { name },},constraints: { name },indexes: { expr },}';

	// not sure if these are the right types for everything but copilot suggested them so why not take them ¯\_(ツ)_/¯
	const result = (await client.query(queryString)) as {
		name: string;
		abstract: boolean;
		bases: { name: string }[];
		ancestors: { name: string }[];
		annotations: { name: string; '@value': string }[];
		links: {
			name: string;
			cardinality: string;
			required: boolean;
			target: { name: string };
		}[];
		properties: {
			name: string;
			annotations: { name: string; '@value': string }[];
			cardinality: string;
			required: boolean;
			target: { name: string };
		}[];
		constraints: { name: string }[];
		indexes: { expr: string }[];
	}[];

	for (const module of result) {
		const moduleName = module.name;
		// skip built-in modules
		if (
			moduleName.startsWith('sys::') ||
			moduleName.startsWith('schema::') ||
			moduleName.startsWith('cfg::') ||
			moduleName.startsWith('std::') ||
			moduleName.startsWith('helper::')
		) {
			continue;
		}

		const properties = module['properties'];

		for (const property of properties) {
			const name = property.name;

			// filter out properties that are not annotated with the correct annotation
			const annotations = property.annotations.filter((annotation: any) => annotation.name === `${config.module}::${config.annotation}`);

			// add property to allModules
			if (!allModules[$.util.splitName(moduleName).mod]) {
				allModules[$.util.splitName(moduleName).mod] = {};
			}
			if (!allModules[$.util.splitName(moduleName).mod][$.util.splitName(moduleName).name]) {
				allModules[$.util.splitName(moduleName).mod][$.util.splitName(moduleName).name] = {};
			}
			allModules[$.util.splitName(moduleName).mod][$.util.splitName(moduleName).name][name] = {
				required: property.required
			};

			// add property to annnotatedModules
			for (const annotation of annotations) {
				let value = annotation['@value'];
				const isLink = value.endsWith('[]');
				if (isLink) {
					value = value.slice(0, -2);
				}

				if (!annnotatedModules[$.util.splitName(moduleName).mod]) {
					annnotatedModules[$.util.splitName(moduleName).mod] = {};
				}
				if (!annnotatedModules[$.util.splitName(moduleName).mod][$.util.splitName(moduleName).name]) {
					annnotatedModules[$.util.splitName(moduleName).mod][$.util.splitName(moduleName).name] = {};
				}
				annnotatedModules[$.util.splitName(moduleName).mod][$.util.splitName(moduleName).name][name] = {
					value,
					isLink,
					required: property.required
				};
			}
		}
	}

	for (const module in annnotatedModules) {
		// create namespace if module is not default
		if (module !== 'default') overrideFunctionString += `export namespace ${module} {\n`;
		for (const type in annnotatedModules[module]) {
			for (const property in annnotatedModules[module][type]) {
				const { value, isLink } = annnotatedModules[module][type][property];
				overrideFunctionString += createOverrideFunction(module + '::' + type, property, value, isLink);
			}
		}
		if (module !== 'default') overrideFunctionString += `}\n`;
	}

	// filter out duplicate imports
	for (const _import of importList.filter((value, index, array) => array.indexOf(value) === index)) {
		importString += createImportString(_import);
	}

	const resultString = importString + typeString + overrideFunctionString;
	const output = prettier.format(resultString, {
		parser: 'typescript',
		tabWidth: 4,
		trailingComma: 'none',
		singleQuote: true,
		printWidth: 140,
		useTabs: true
	});
	fs.writeFileSync('./dbschema/override.ts', output);
})();
