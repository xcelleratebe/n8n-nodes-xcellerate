import {
	IDataObject,
	IExecuteFunctions,
	IHttpRequestMethods,
	INodeProperties,
	IRequestOptions, NodeApiError,
	updateDisplayOptions,
} from 'n8n-workflow';
import { xcellerateApiRequest } from '../../transport';
import { actionCommand, agentUuid } from '../../descriptions';
import { getActionFromNode } from '../../helpers/actions';

export const properties: INodeProperties[] = [
	... agentUuid,
	... actionCommand,
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

	const {command, properties} = getActionFromNode.call(
		this,
		index
	);

	let requestOptions: IRequestOptions;
	requestOptions = {
		method: 'POST' as IHttpRequestMethods,
		json: true,
		body: {
			agents: agentUuids,
			command: command,
			properties: properties
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
