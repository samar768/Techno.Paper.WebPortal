// import zod
import { z } from 'zod';

export const VoucherTypeSchema = z.array(
	z.object({
		V_Type: z.string(),
		Description: z.string(),
	})
);

export const CustomerSchema = z.array(
	z.object({
		SubCode: z.string(),
		Description: z.string(),
		ManualCode: z.string(),
		Address: z.string(),
		CityName: z.string(),
		DName: z.string(),
		DISCity: z.string(),
		Zone: z.string(),
		DZone: z.string(),
		CityCode: z.string(),
	})
);

export const GenericLookupSchema = z.object({
	Code: z.string(),
	Description: z.string(),
});

export const CitySchema = z.object({
	Code: z.string(),
	Description: z.string(),
	State: z.string(),
});

export const ItemSchema = z.object({
	Code: z.string(),
	Description: z.string(),
	ManualCode: z.string(),
	SKU: z.string(),
	SecondryUnit: z.string(),
	ConversionRate: z.number(),
	Varity: z.string().nullable(),
	GSM: z.string().nullable(),
	GSMCode: z.string().nullable(),
	SizeLength: z.string(),
	SizeWidth: z.string(),
	ItemID: z.string(),
	BFCode: z.string().nullable(),
	BFName: z.string().nullable(),
	Grain: z.string(),
});

export const SiteSchema = z.array(
	z.object({
		Code: z.string(),
		Description: z.string(),
		Code1: z.string(),
		Name: z.string(),
		ManualCode: z.string(),
		HO_YN: z.string(),
		Transfered: z.string(),
		SiteDesc: z.string(),
		SubCode: z.string(),
		Address1: z.string(),
		Address2: z.string(),
		City: z.string(),
		Pin: z.string(),
		ECCCode: z.string(),
		ExRange: z.string(),
		ExRegNo: z.string(),
		ExDivision: z.string(),
		ExColl: z.string(),
		PANNo: z.string(),
		LSTNo: z.string(),
		LSTDate: z.string().nullable(),
		CSTNo: z.string(),
		CSTDate: z.string().nullable(),
		TinNo: z.string(),
		TinDate: z.string().nullable(),
		NotificationNo: z.string(),
		Phone: z.string(),
		Fax: z.string(),
		Email: z.string(),
		Gram: z.string(),
		Country: z.string(),
		PreparedBy: z.string().nullable(),
		ModifiedBy: z.string(),
		TransferDt: z.string().nullable(),
		State_Code: z.string(),
		State_Name: z.string(),
		GSTINNo: z.string(),
		GSTINDate: z.string(),
		UTYN: z.string(),
		SiteDetAsComDet: z.string(),
		LegalName: z.string().nullable(),
		TradeName: z.string().nullable(),
		IsSync: z.string().nullable(),
	})
);

export type NormalizedLookup = {
	Code: string;
	Description: string;
	ColumnHeaders?: string[];
	Additional?: string[];
};

// Config array: pairs each schema with a transform function
export const schemaTransformers: {
	schema: z.ZodTypeAny;
	transform: (parsed: any) => NormalizedLookup;
}[] = [
	{
		// VoucherTypeSchema: V_Type, Description
		schema: VoucherTypeSchema.element,
		transform: (parsed) => ({
			Code: parsed.V_Type,
			Description: parsed.Description,
			ColumnHeaders: [],
			Additional: [],
		}),
	},
	{
		// CustomerSchema: SubCode, Description, ManualCode, Address, CityName, etc.
		schema: CustomerSchema.element,
		transform: (parsed) => ({
			Code: parsed.SubCode,
			Description: parsed.Description,
			ColumnHeaders: ['Manual Code', 'Address', 'City'],
			Additional: [
				parsed.ManualCode ?? '',
				parsed.Address ?? '',
				parsed.CityName ?? '',
			],
		}),
	},
	{
		// CitySchema: Code, Description, State
		schema: CitySchema,
		transform: (parsed) => ({
			Code: parsed.Code,
			Description: parsed.Description,
			ColumnHeaders: ['State'],
			Additional: [parsed.State ?? ''],
		}),
	},
	{
		// ItemSchema: Code, Description, ManualCode, SKU, etc.
		schema: ItemSchema,
		transform: (parsed) => ({
			Code: parsed.Code,
			Description: parsed.Description,
			ColumnHeaders: [
				'Manual Code',
				'SKU',
				'Varity',
				'GSM',
				'Length',
				'Width',
			],
			Additional: [
				parsed.ManualCode ?? '',
				parsed.SKU ?? '',
				parsed.Varity ?? '',
				parsed.GSM ?? '',
				parsed.SizeLength ?? '',
				parsed.SizeWidth ?? '',
			],
		}),
	},
	{
		// SiteSchema: Code, Description, Address1, Address2, City, etc.
		schema: SiteSchema.element,
		transform: (parsed) => ({
			Code: parsed.Code,
			Description: parsed.Description,
			ColumnHeaders: ['Address 1', 'Address 2', 'City', 'State'],
			Additional: [
				parsed.Address1 ?? '',
				parsed.Address2 ?? '',
				parsed.City ?? '',
				parsed.State_Name ?? '',
			],
		}),
	},
	{
		// GenericLookupSchema: Code, Description
		schema: GenericLookupSchema,
		transform: (parsed) => ({
			Code: parsed.Code,
			Description: parsed.Description,
		}),
	},
];

// Cleaner normalization function using the config
export function normalizeLookup(data: unknown): NormalizedLookup {
	for (const { schema, transform } of schemaTransformers) {
		const result = schema.safeParse(data);
		if (result.success) {
			return transform(result.data);
		}
	}
	throw new Error('Invalid lookup format');
}
