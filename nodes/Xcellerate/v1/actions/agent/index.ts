import type { INodeProperties } from 'n8n-workflow';
import * as list from './list.operation';
import * as get from './get.operation';
import * as sendAction from './sendAction.operation';
import * as sendScript from './sendScript.operation';

export { list, get, sendAction, sendScript }

export const description: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['agent']
			}
		},
		options: [
			{
				name: 'List',
				value: 'list',
				description: 'List agents',
				action: 'List agents',
			},
			{
				name: 'Get',
				value: 'get',
				description: 'Get specific agent',
				action: 'Get specific agent',
			},
			{
				name: 'Send Action',
				value: 'sendAction',
				action: 'Send action',
			},
			{
				name: 'Execute Script',
				value: 'sendScript',
				action: 'Execute script',
			}
		],
		default: 'list',
	},
	... list.description,
	... get.description,
	... sendAction.description,
	... sendScript.description,
];
