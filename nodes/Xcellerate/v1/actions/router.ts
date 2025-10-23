import {IExecuteFunctions, INodeExecutionData, NodeApiError, NodeOperationError} from 'n8n-workflow';

import * as agent from './agent';
import * as group from './group';
import * as action from './action';
import * as vulnerability from './vulnerability';
import { Xcellerate } from './node.type';

export async function router(this: IExecuteFunctions) {
	const items = this.getInputData();
	const returnData: INodeExecutionData[] = [];
	let responseData;
	const resource = this.getNodeParameter<Xcellerate>('resource', 0) as string;
	const operation = this.getNodeParameter('operation', 0);

	const xcellerate = {
		resource,
		operation
	} as Xcellerate;

	const bulkData = await handleBulkAction.call(this, xcellerate);
	if (bulkData !== false) {
		return bulkData;
	}

	for (let i = 0; i < items.length; i++) {
		try {
			switch (xcellerate.resource) {
				case 'agent':
					responseData = await agent[xcellerate.operation].execute.call(this, i);
					break;
				case 'group':
					responseData = await group[xcellerate.operation].execute.call(this, i);
					break ;
				case 'vulnerability':
					responseData = await vulnerability[xcellerate.operation].execute.call(this, i);
					break ;
				default:
					throw new NodeOperationError(this.getNode(), `The resource ${resource} is not known`);
			}
			returnData.push(...responseData);
		} catch (error) {
			if (this.continueOnFail()) {
				const executionErrorData = this.helpers.constructExecutionMetaData(
					this.helpers.returnJsonArray({ error: error.message }),
					{ itemData: { item: i } },
				);
				returnData.push(...executionErrorData);
				continue;
			}

			if (error instanceof NodeApiError && error?.context?.itemIndex === undefined) {
				if (error.context === undefined) {
					error.context = {};
				}
				error.context.itemIndex = i;
			}
			throw error;
		}
	}
	return [returnData];
}

async function handleBulkAction(this: IExecuteFunctions, xcellerate: Xcellerate) {
	let responseData;
	if (xcellerate.resource === 'agent'
		&& (xcellerate.operation === 'sendAction' || xcellerate.operation === 'sendScript')
	) {
		responseData = await agent[xcellerate.operation].execute.call(this, 0);
		return [responseData];
	}

	if (xcellerate.resource === 'action' && xcellerate.operation === 'bulk') {
		responseData = await action[xcellerate.operation].execute.call(this, 0);
		return [responseData];
	}


	if (xcellerate.resource === 'vulnerability' && xcellerate.operation === 'user') {
		responseData = await vulnerability[xcellerate.operation].execute.call(this, 0);
		return [responseData];
	}

	return false;
}


