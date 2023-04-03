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

type A_User = Simplify<
	Override<
		User,
		{
			tasks: Simplify<Task>[];
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

type testModule_A_hasasdda = Simplify<
	Override<
		_testModule.hasasdda,
		{
			users: Simplify<User>[];
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
	// @ts-ignore
	return _Task;
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
	// @ts-ignore
	return _User;
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
	// @ts-ignore
	return _test0;
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
		// @ts-ignore
		return _hasasdda;
	}
}
