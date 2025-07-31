import {
	DeclarativeRestApiSettings,
	IDataObject,
	IExecuteFunctions,
	INodeProperties,
	updateDisplayOptions,
} from 'n8n-workflow';
import { xcellerateApiRequest, xcellerateApiRequestAll } from '../../transport';
import { returnAllOrLimit } from '../../descriptions';
import HttpRequestOptions = DeclarativeRestApiSettings.HttpRequestOptions;

export const properties: INodeProperties[] = [
	... returnAllOrLimit,
];

const displayOptions = {
	show: {
		resource: ['agent'],
		operation: ['list'],
	}
}

export const description = updateDisplayOptions(
	displayOptions,
	properties
);

export async function execute(this: IExecuteFunctions, index: number) {
	let responseData;
	const returnAll = this.getNodeParameter('returnAll', index);
	if (returnAll) {
		responseData = await xcellerateApiRequestAll.call(this, '/agents');
	} else {
		const requestOptions: HttpRequestOptions = {
			qs: {
				perPage: this.getNodeParameter('limit', 0, 20),
			}
		}

		responseData = await xcellerateApiRequest.call(
			this,
			'/agents',
			requestOptions
		)
		responseData = responseData.data;
	}

	const executionData = this.helpers.constructExecutionMetaData(
		this.helpers.returnJsonArray(responseData as IDataObject),
		{ itemData : { item: index } },
	)

	return executionData;
}
