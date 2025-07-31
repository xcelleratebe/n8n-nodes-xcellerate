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
		displayName: 'Script',
		name: 'script',
		/* eslint-disable n8n-nodes-base/node-param-description-wrong-for-dynamic-options */
		/* Disabling this, because we set noDataExpression */
		description: 'The script to execute on the agent(s)',
		type: 'options',
		typeOptions: {
			loadOptionsMethod: 'getScripts'
		},
		noDataExpression: true,
		default: '',
	},
];

const displayOptions = {
	show: {
		resource: ['agent'],
		operation: ['sendScript'],
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
	const script = this.getNodeParameter('script', 0) as string;
	let requestOptions: IRequestOptions;
	requestOptions = {
		method: 'POST' as IHttpRequestMethods,
		json: true,
		body: {
			agent_uuids: agentUuids,
			script_id: script,
		}
	}

	const responseData = await xcellerateApiRequest.call(
		this,
		'/scripts/execute',
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
