<div align="center">
	<h1>EdgeDB-json</h1>
	<h3>Easy to use code generator for typing json properties in EdgeDB.</h3>
	<a href="https://www.npmjs.com/package/edgedb-json">
		<img alt="npm license" src="https://img.shields.io/npm/l/edgedb-json">
	</a>
	<a href="https://www.npmjs.com/package/edgedb-json">
		<img alt="npm license" src="https://img.shields.io/npm/v/edgedb-json">
	</a>
</div>

<br>

## Installation

```
npm install --save-dev edgedb-json
```

## Usage

Run the following command to generate the types.

This will generate a `override.ts` file in the `dbschema` directory.

```
npx edgedb-json [options]
```

By default EdgeDB-json will also run `npx @edgedb/generate interfaces`. To disable this use the `--override-only` option.

## Schema

EdgeDB-json uses annotations to define the types of the json properties.

In order for EdgeDB-json to recognize annotations we must define a abstract annotation first.

Both the module name as well as annotation name can be configured

```ts
module EDGEDB_JSON { // Module that holds the abstract annotation
    abstract annotation JSON_TYPE; // This will be used to link the json property to a type
}
```

The annotation can be used like this:

```ts
module default {
    type User {
        property name -> str;
        property email -> str;
        property tasks -> json {
            annotation EDGEDB_JSON::JSON_TYPE := 'default::Task[]'; // Needs to directly reference the type in the style of `module::type` // Add [] at the end to make it behave like a link
            default := <json>[];
        }
    }

    abstract type Task { // create type (does not need to be abstract but helps to differentiate between types)
        required property name -> str;
        property description -> str;
        property questions -> json {    // nested types are no problem as well
            annotation EDGEDB_JSON::JSON_TYPE := 'default::Questions[]';
            default := <json>[];
        }
    }

    abstract type Questions {
        required property name -> str;
        required property description -> str;
        required property question -> str;
        required property answer -> int16;
    }
}
```

## Consuming the types

Run `npx edgedb-json` to generate the types.

```ts
import { override_User_tasks } from './dbschema/override';

(async () => {
	const query = e.select(e.User, () => ({
		id: true,
		email: true,
		tasks: true
	}));

	const results = await query.run(client);
	const users = override_Module_tasks(results);

    users[0].tasks?[0].name // string
    users[0].tasks?[0].questions?[0].answer // number

    users[0].tasks // TODO
})();
```

## Configuration

Add to `edgedb.toml`

```toml
[edgedb-json]
module = "MyModuleName" # Module name
annotation = "MyAnnotationName" # Annotation name
```
