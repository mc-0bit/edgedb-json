import { createClient } from 'edgedb';
import e from '../dbschema/edgeql-js';
import { override_User_tasks, override_Task_questions, testModule } from '../dbschema/override';

export const client = createClient();

(async () => {
	const query = e.select(e.testModule.hasasdda, () => ({
		id: true,
		users: true
	}));
	const results = await query.run(client);
	const hasasdda = testModule.override_hasasdda_users(results);
	const hasasdda1 = hasasdda[0];
})();
