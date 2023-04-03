import { createClient } from 'edgedb';
import e from '../dbschema/edgeql-js';
import { override_User_tasks, override_Task_questions, testModule } from '../dbschema/override';

export const client = createClient();

(async () => {
	const query = e.select(e.User, () => ({
		id: true,
		email: true,
		tasks: true,
	}));
	const results = await query.run(client);
	const users = override_User_tasks(results);
	const user = users[0];

	user.tasks /*
	tasks: {
		id: string;
		name: string;
		description?: string | null | undefined;
		questions?: {
				answer: number;
				description: string;
				question: string;
				name?: string | null | undefined;
				id: string;
		}[] | undefined;
	}[]
	*/
})();
