import { IDataObject, IExecuteFunctions, INodeProperties, updateDisplayOptions } from 'n8n-workflow';
import { buildHttpRequest, xcellerateApiRequest } from '../../transport';
import { queryAble, returnAllOrLimit } from '../../descriptions';

export const properties: INodeProperties[] = [
	... returnAllOrLimit,
	... queryAble,
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
	const requestOptions = buildHttpRequest({
		returnAll: returnAll,
	});

	responseData = await xcellerateApiRequest.call(
		this,
		'/agents',
		requestOptions,
		returnAll,
		{
			index: index,
		}
	)

	return this.helpers.constructExecutionMetaData(
		this.helpers.returnJsonArray(responseData as IDataObject),
		{ itemData: { item: index } },
	);
}
