import {
	IDataObject,
	IExecuteFunctions,
	IHttpRequestMethods,
	INodeProperties,
	IRequestOptions, NodeApiError,
	updateDisplayOptions,
} from 'n8n-workflow';
import { xcellerateApiRequest } from '../../transport';

export const properties: INodeProperties[] = [
	{
		displayName: 'Agent UUID',
		name: 'agentUuid',
		description: 'The UUID of the agent to fetch data from',
		type: 'string',
		required: true,
		default: '',
	},
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

const displayOptions = {
	show: {
		resource: ['agent'],
		operation: ['sendAction'],
	}
}

export const description = updateDisplayOptions(
	displayOptions,
	properties
);

export async function execute(this: IExecuteFunctions, index: number) {
	const items = this.getInputData();
	let agentUuids = [];
	for (const key in items) {
		const item = items[key];
		agentUuids.push(item.json.uuid);
	}
	const command = this.getNodeParameter('command', 0) as string;
	let properties = this.getNodeParameter('properties', 0, '{}') as string;
	let objectProperties = JSON.parse(properties);
	if (command === 'APPDEPLOYUPD') {
		objectProperties = {
			packages: this.getNodeParameter('packages.packageValues', 0, [])
		}
	}

	this.logger.warn(properties);

	let requestOptions: IRequestOptions;
	requestOptions = {
		method: 'POST' as IHttpRequestMethods,
		json: true,
		body: {
			agents: agentUuids,
			command: command,
			properties: objectProperties
		}
	}

	const responseData = await xcellerateApiRequest.call(
		this,
		'/actions/bulk',
		requestOptions
	);

	if (responseData.status !== 'OK' && !this.continueOnFail()) {
		throw NodeApiError;
	}

	const executionData = this.helpers.constructExecutionMetaData(
		this.helpers.returnJsonArray(responseData.data as IDataObject),
		{ itemData : { item: index } },
	)

	return executionData;
}
