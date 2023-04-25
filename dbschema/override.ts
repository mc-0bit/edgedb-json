import type { Questions } from './interfaces';
import type { Task } from './interfaces';
import type { User } from './interfaces';
import type { testModule as _testModule } from './interfaces';
import type { test0 } from './interfaces';

import type { Simplify, SetRequired } from 'type-fest';
type Override<T, R> = Omit<T, keyof R> & R;

type A_Task = Simplify<
	Override<
		Task,
		{
			questions?: Simplify<Questions>[];
		}
	>
>;

type Object_A_Task = Simplify<
	Override<
		Task,
		{
			questions?: Simplify<Questions>[];
		}
	>
>;

type A_User = Simplify<
	Override<
		User,
		{
			tasks: Simplify<Task>[];
		}
	>
>;

type Object_A_User = Simplify<
	Override<
		User,
		{
			tasks: Simplify<A_Task>[];
		}
	>
>;

type A_test0 = Simplify<
	Override<
		test0,
		{
			hasasdda: Simplify<testModule_A_hasasdda>[];
		}
	>
>;

type Object_A_test0 = Simplify<
	Override<
		test0,
		{
			hasasdda: Simplify<testModule_A_hasasdda>[];
		}
	>
>;

type testModule_A_hasasdda = Simplify<
	Override<
		_testModule.hasasdda,
		{
			users: Simplify<User>[];
		}
	>
>;

type Object_testModule_A_hasasdda = Simplify<
	Override<
		_testModule.hasasdda,
		{
			users: Simplify<A_User>[];
		}
	>
>;

type T_Task = SetRequired<Partial<Task>, 'questions'>;
export function override_Task_questions<Task extends T_Task | T_Task[]>(
	_Task: Task
): Task extends Array<infer U>
	? Simplify<
			Override<
				U,
				{
					questions: Simplify<Questions>[];
				}
			>
	  >[]
	: Simplify<
			Override<
				Task,
				{
					questions: Simplify<Questions>[];
				}
			>
	  > {
	const resultArray: Task[] = [];
	if (Array.isArray(_Task)) {
		for (const _TaskItem of _Task) {
			_TaskItem.progress = JSON.parse(_TaskItem.progress);
			// @ts-ignore
			resultArray.push(_TaskItem);
		}
		// @ts-ignore
		return resultArray;
	} else {
		// @ts-ignore
		_Task.progress = JSON.parse(_Task.progress);
		// @ts-ignore
		return _Task;
	}
}

type T_User = SetRequired<Partial<User>, 'tasks'>;
export function override_User_tasks<User extends T_User | T_User[]>(
	_User: User
): User extends Array<infer U>
	? Simplify<
			Override<
				U,
				{
					tasks: Simplify<A_Task>[];
				}
			>
	  >[]
	: Simplify<
			Override<
				User,
				{
					tasks: Simplify<A_Task>[];
				}
			>
	  > {
	const resultArray: User[] = [];
	if (Array.isArray(_User)) {
		for (const _UserItem of _User) {
			_UserItem.progress = JSON.parse(_UserItem.progress);
			// @ts-ignore
			resultArray.push(_UserItem);
		}
		// @ts-ignore
		return resultArray;
	} else {
		// @ts-ignore
		_User.progress = JSON.parse(_User.progress);
		// @ts-ignore
		return _User;
	}
}

type T_test0 = SetRequired<Partial<test0>, 'hasasdda'>;
export function override_test0_hasasdda<test0 extends T_test0 | T_test0[]>(
	_test0: test0
): test0 extends Array<infer U>
	? Simplify<
			Override<
				U,
				{
					hasasdda: Simplify<testModule_A_hasasdda>[];
				}
			>
	  >[]
	: Simplify<
			Override<
				test0,
				{
					hasasdda: Simplify<testModule_A_hasasdda>[];
				}
			>
	  > {
	const resultArray: test0[] = [];
	if (Array.isArray(_test0)) {
		for (const _test0Item of _test0) {
			_test0Item.progress = JSON.parse(_test0Item.progress);
			// @ts-ignore
			resultArray.push(_test0Item);
		}
		// @ts-ignore
		return resultArray;
	} else {
		// @ts-ignore
		_test0.progress = JSON.parse(_test0.progress);
		// @ts-ignore
		return _test0;
	}
}
export namespace testModule {
	type T_hasasdda = SetRequired<Partial<_testModule.hasasdda>, 'users'>;
	export function override_hasasdda_users<hasasdda extends T_hasasdda | T_hasasdda[]>(
		_hasasdda: hasasdda
	): hasasdda extends Array<infer U>
		? Simplify<
				Override<
					U,
					{
						users: Simplify<A_User>[];
					}
				>
		  >[]
		: Simplify<
				Override<
					hasasdda,
					{
						users: Simplify<A_User>[];
					}
				>
		  > {
		const resultArray: hasasdda[] = [];
		if (Array.isArray(_hasasdda)) {
			for (const _hasasddaItem of _hasasdda) {
				_hasasddaItem.progress = JSON.parse(_hasasddaItem.progress);
				// @ts-ignore
				resultArray.push(_hasasddaItem);
			}
			// @ts-ignore
			return resultArray;
		} else {
			// @ts-ignore
			_hasasdda.progress = JSON.parse(_hasasdda.progress);
			// @ts-ignore
			return _hasasdda;
		}
	}
}
