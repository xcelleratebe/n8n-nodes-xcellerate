import { INodeProperties } from 'n8n-workflow';

import * as list from './list.operation';
import * as listAgents from './listAgents.operation';

export { list, listAgents }

export const description: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['group']
			}
		},
		default: 'list',
		options: [
			{
				name: 'List',
				value: 'list',
				description: 'List groups',
				action: 'List groups',
			},
			{
				name: 'Group Agents',
				value: 'listAgents',
				description: 'List agents for a group',
				action: 'List agents for a group',
			}
		],
	},
	... list.description,
	... listAgents.description,
];
