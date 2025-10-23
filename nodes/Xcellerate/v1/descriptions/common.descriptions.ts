import { INodeProperties } from 'n8n-workflow';

export const returnAllOrLimit: INodeProperties[] = [
	{
		displayName: 'Return All',
		name: 'returnAll',
		type: 'boolean',
		default: false,
		description: 'Whether to return all results or only up to a given limit',
	},
	{
		displayName: 'Limit',
		name: 'limit',
		type: 'number',
		displayOptions: {
			show: {
				returnAll: [false],
			},
		},
		typeOptions: {
			minValue: 1,
		},
		default: 50,
		description: 'Max number of results to return',
	},
];

export const queryAble: INodeProperties[] = [
	{
		displayName: 'Query',
		name: 'query',
		type: 'string',
		default: '',
	}
];

export const agentUuid: INodeProperties[] = [
	{
		displayName: 'Agent UUID',
		name: 'agentUuid',
		description: 'The UUID of the agent to fetch data from',
		type: 'string',
		required: true,
		default: '',
	},
];

export const actionCommand: INodeProperties[] = [
	{
		/* eslint-disable n8n-nodes-base/node-param-display-name-wrong-for-dynamic-options */
		/* Disabling this, because we set noDataExpression */
		displayName: 'Action',
		name: 'command',
		/* eslint-disable n8n-nodes-base/node-param-description-wrong-for-dynamic-options */
		/* Disabling this, because we set noDataExpression */
		description: 'The action to send to the agent(s)',
		type: 'options',
		typeOptions: {
			loadOptionsMethod: 'getCommands'
		},
		noDataExpression: true,
		default: '',
	},
	{
		displayName: 'Properties',
		name: 'properties',
		type: 'json',
		default: '{}',
		displayOptions: {
			hide: {
				command: ['APPDEPLOYUPD'],
			},
		}
	},
	{
		displayName: 'Packages',
		name: 'packages',
		type: 'fixedCollection',
		hint: 'Add specific packages here or leave this empty for an update of all packages',
		default: {  },
		typeOptions: {
			multipleValues: true,
		},
		placeholder: 'Add package',
		displayOptions: {
			show: {
				command: ['APPDEPLOYUPD'],
			},
		},
		options: [
			{
				name: 'packageValues',
				displayName: 'Packages',
				values: [
					{
						displayName: 'Engine',
						name: 'engine',
						type: 'options',
						default: 'chocolatey',
						noDataExpression: true,
						options: [
							{
								name: 'Chocolatey',
								displayName: 'Chocolatey',
								value: 'chocolatey'
							}
						],
						required: true,
					},
					{
						displayName: 'Package ID',
						name: 'name',
						type: 'options',
						typeOptions: {
							loadOptionsMethod: 'getPackages'
						},
						noDataExpression: true,
						default: '',
						description: 'The name of the package',
						required: true,
					},
				],
			},
		]
	}
];
