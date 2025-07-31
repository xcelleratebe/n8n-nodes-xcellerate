import { INodeProperties } from 'n8n-workflow';

import * as bulk from './bulk.operation';

export { bulk }

export const description: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['action']
			}
		},
		default: 'list',
		options: [
			{
				name: 'Bulk',
				value: 'bulk',
				description: 'Get action statuses',
				action: 'Get action statuses',
			},
		],
	},
  ... bulk.description,
];
