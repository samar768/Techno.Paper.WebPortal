'use client';

export type SaleOrderItemRow = {
	sn: number;
	itemName: string;
	description: string;
	bf: string;
	width: string;
	length: string;
	unit: string;
	grain: string;
	gsm: string;
	reelPack: string;
	weightSecUnit: string;
	secUnit: string;
	weightSku: string;
	tol: string;
	skuUnit: string;
	rate: string;
	amount: string;
	oh: string;
	ad: string;
};

export type SaleOrderDetail = {
	id: string; // matches list id (using sku for now)
	orderNo: string;
	orderDate: string;
	party: string;
	distributor: string;
	partyOrderNo: string;
	againstForm: string;
	deliveryTo: string;
	deliveryDate: string;
	orderType: string;
	consignee: string;
	toPlace: string;
	partyDate: string;
	excisable: string;
	dutyTaxes: string;
	freight: string;
	remark: string;
	delivery: string;
	headGrossAmount: string;
	headBillAmount: string;
	headRoundOff: string;
	headNetAmount: string;
	totalQty: string;
	totalWeight: string;
	rows: SaleOrderItemRow[];
};

const rows: SaleOrderItemRow[] = [
	{ sn: 1, itemName: 'Kraft Paper..', description: '', bf: '14', width: '96.5..', length: '0.000', unit: 'CM', grain: 'Lo..', gsm: '80', reelPack: '6.00', weightSecUnit: '0.000', secUnit: '0.000', weightSku: '3450.000', tol: '', skuUnit: 'Kg.', rate: '25.000000', amount: '86250.00', oh: '', ad: '' },
	{ sn: 2, itemName: 'Kraft Paper..', description: '', bf: '14', width: '91.5..', length: '0.000', unit: 'CM', grain: 'Lo..', gsm: '80', reelPack: '2.00', weightSecUnit: '0.000', secUnit: '0.000', weightSku: '1700.000', tol: '', skuUnit: 'Kg.', rate: '25.000000', amount: '42500.00', oh: '', ad: '' },
	{ sn: 3, itemName: 'Kraft Paper..', description: '', bf: '14', width: '101..', length: '0.000', unit: 'CM', grain: 'Lo..', gsm: '80', reelPack: '2.00', weightSecUnit: '0.000', secUnit: '0.000', weightSku: '1250.000', tol: '', skuUnit: 'Kg.', rate: '25.000000', amount: '31250.00', oh: '', ad: '' },
	{ sn: 4, itemName: 'Kraft Paper..', description: '', bf: '14', width: '107..', length: '0.000', unit: 'CM', grain: 'Lo..', gsm: '80', reelPack: '4.00', weightSecUnit: '0.000', secUnit: '0.000', weightSku: '2580.000', tol: '', skuUnit: 'Kg.', rate: '25.000000', amount: '64500.00', oh: '', ad: '' },
];

const template: Omit<SaleOrderDetail, 'id'> = {
	orderNo: '1333',
	orderDate: '2019/03/31',
	party: 'PAPIER & PRINTING',
	distributor: 'HINDUSTHAN ENTERPRISE',
	partyOrderNo: '1333',
	againstForm: 'LGST-SALES',
	deliveryTo: 'PAPIER & PRINTING',
	deliveryDate: '2019/03/31',
	orderType: 'Paper',
	consignee: 'PAPIER & PRINTING',
	toPlace: 'Kolkata',
	partyDate: '2019/03/31',
	excisable: 'Yes',
	dutyTaxes: 'ED+VAT+INS',
	freight: 'To Pay',
	remark: '',
	delivery: '',
	headGrossAmount: '227450.00',
	headBillAmount: '0.000',
	headRoundOff: '0.000',
	headNetAmount: '0.00',
	totalQty: '22.00',
	totalWeight: '12410.00',
	rows,
};

export const saleOrdersById: Record<string, SaleOrderDetail> = {
	'DMZSOGST 2021 10': { id: 'DMZSOGST 2021 10', ...template },
	'DMZSOGST 2021 11': { id: 'DMZSOGST 2021 11', ...template },
	'DMZSOGST 2021 12': { id: 'DMZSOGST 2021 12', ...template },
	'DMZSOGST 2021 04': { id: 'DMZSOGST 2021 04', ...template },
};


