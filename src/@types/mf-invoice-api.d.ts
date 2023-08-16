declare namespace MfInvoiceApi {
  /**
   * PaginationData
   * https://invoice.moneyforward.com/docs/api/v3/index.html#/schemas/PaginationData
   */
  interface PaginationData {
    total_count: number;
    total_pages: number;
    per_page: number;
    current_page: number;
  }

  /**
   * BillingItem
   * https://invoice.moneyforward.com/docs/api/v3/index.html#/schemas/BillingItem
   */
  interface BillingItem {
    id: string;
    name: string;
    code: string;
    detail?: string;
    unit?: string;
    price?: string;
    quantity?: string;
    is_deduct_withholding_tax?: boolean;
    excise?: string;
    created_at: string;
    updated_at: string;
    delivery_number?: string;
    delivery_date?: string;
  }

  /**
   * 請求書作成のリクエストボディ
   */
  interface BillingItemReqBody {
    item_id: string;
    delivery_number?: string;
    delivery_date?: string;
    detail: string;
    unit: string;
    price: number;
    quantity: number;
    is_deduct_withholding_tax: boolean;
    excise: Excise;
  }

  /**
   * Billing
   * https://invoice.moneyforward.com/docs/api/v3/index.html#/schemas/Billing
   */
  interface Billing {
    id: string;
    pdf_url: string;
    operator_id: string;
    department_id: string;
    member_id: string;
    member_name: string;
    partner_id: string;
    partner_name: string;
    office_id?: string;
    office_name: string;
    office_detail: string;
    title: string;
    memo?: string;
    payment_condition: string;
    billing_date: string;
    due_date: string;
    sales_date?: string;
    billing_number?: string;
    note?: string;
    document_name?: string;
    payment_status?: string;
    email_status?: string;
    posting_status?: string;
    created_at: string;
    updated_at?: string;
    is_downloaded: boolean;
    is_locked: boolean;
    deduct_price: string;
    tag_names: string[];
    items: BillingItem[];
    excise_price: string;
    excise_price_of_untaxable?: string;
    excise_price_of_non_taxable?: string;
    excise_price_of_tax_exemption?: string;
    excise_price_of_five_percent?: string;
    excise_price_of_eight_percent?: string;
    excise_price_of_eight_percent_as_reduced_tax_rate?: string;
    excise_price_of_ten_percent?: string;
    subtotal_price: string;
    subtotal_of_untaxable_excise?: string;
    subtotal_of_non_taxable_excise?: string;
    subtotal_of_tax_exemption_excise?: string;
    subtotal_of_five_percent_excise?: string;
    subtotal_of_eight_percent_excise?: string;
    subtotal_of_eight_percent_as_reduced_tax_rate_excise?: string;
    subtotal_of_ten_percent_excise?: string;
    subtotal_with_tax_of_untaxable_excise?: string;
    subtotal_with_tax_of_non_taxable_excise?: string;
    subtotal_with_tax_of_tax_exemption_excise?: string;
    subtotal_with_tax_of_five_percent_excise?: string;
    subtotal_with_tax_of_eight_percent_excise?: string;
    subtotal_with_tax_of_eight_percent_as_reduced_tax_rate_excise?: string;
    subtotal_with_tax_of_ten_percent_excise?: string;
    total_price: string;
    registration_code?: string;
    use_invoice_template: boolean;
  }

  /**
   * 請求書作成のリクエストボディ
   */
  interface BillingReqBody {
    department_id: string;
    title: string;
    memo: string;
    payment_condition: string;
    billing_date: string;
    due_date: string;
    sales_date: string;
    billing_number: string;
    note: string;
    document_name: string;
    tag_names: string[];
    items: BillingItemReqBody[];
  }

  /**
   * Get Billings
   * https://invoice.moneyforward.com/docs/api/v3/index.html#/operations/get-billings
   */
  interface BillingsResponse {
    data: BillingData[];
    pagination: PaginationData;
  }

  /**
   * Quote
   * https://invoice.moneyforward.com/docs/api/v3/index.html#/schemas/Quote
   */
  interface Quote {
    id: string;
    pdf_url: string;
    operator_id: string;
    department_id: string;
    member_id: string;
    member_name: string;
    partner_id: string;
    partner_name: string;
    partner_detail?: string;
    office_id?: string;
    office_name: string;
    office_detail: string;
    title: string;
    memo?: string;
    quote_date: string;
    quote_number?: string;
    note?: string;
    expired_date: string;
    document_name?: string;
    order_status?: string;
    transmit_status?: string;
    posting_status?: string;
    created_at: string;
    updated_at?: string;
    is_downloaded?: boolean;
    is_locked?: boolean;
    deduct_price?: string;
    tag_names?: string[];
    items: QuoteItem[];
    excise_price: string;
    excise_price_of_untaxable?: string;
    excise_price_of_non_taxable?: string;
    excise_price_of_tax_exemption?: string;
    excise_price_of_five_percent?: string;
    excise_price_of_eight_percent?: string;
    excise_price_of_eight_percent_as_reduced_tax_rate?: string;
    excise_price_of_ten_percent?: string;
    subtotal_price: string;
    subtotal_of_untaxable_excise?: string;
    subtotal_of_non_taxable_excise?: string;
    subtotal_of_tax_exemption_excise?: string;
    subtotal_of_five_percent_excise?: string;
    subtotal_of_eight_percent_excise?: string;
    subtotal_of_eight_percent_as_reduced_tax_rate_excise?: string;
    subtotal_of_ten_percent_excise?: string;
    total_price: string;
  }

  /**
   * 見積書作成の品目リクエストボディ
   */
  interface QuoteItemReqBody {
    item_id: string;
    detail?: string;
    unit?: string;
    price?: number;
    quantity?: number;
    is_deduct_withholding_tax?: boolean;
    excise?: Excise;
  }

  /**
   * 見積書作成時のリクエストボディ
   */
  interface QuoteReqBody {
    department_id: string;
    quote_number?: string;
    title?: string;
    memo?: string;
    quote_date: string;
    expired_date: string;
    note?: string;
    tag_names?: string[];
    document_name?: string;
    items?: QuoteItemReqBody[];
  }

  /**
   * Get Quotes
   * https://invoice.moneyforward.com/docs/api/v3/index.html#/operations/get-quotes
   */

  interface QuotesResponse {
    data: Quote[];
    pagination: PaginationData;
  }

  /**
   * Department
   * https://invoice.moneyforward.com/docs/api/v3/index.html#/schemas/Department
   */
  interface Department {
    id: string;
    zip?: string;
    tel?: string;
    prefecture?: string;
    address1?: string;
    address2?: string;
    person_name?: string;
    person_title?: string;
    person_dept: string;
    email?: string;
    cc_emails?: string;
    office_member_id?: string;
    office_member_name?: string;
    created_at?: string;
    updated_at?: string;
  }

  /**
   * Item
   * https://invoice.moneyforward.com/docs/api/v3/index.html#/schemas/Item
   */
  interface Item {
    id: string;
    name: string;
    code: string;
    detail?: string;
    unit?: string;
    price?: string;
    quantity?: string;
    is_deduct_withholding_tax: boolean;
    excise?: string;
    created_at: string;
    updated_at: string;
  }

  /**
   * 品目作成のリクエストボディ
   */
  interface ItemReqBody {
    name: string;
    code?: string;
    detail?: string;
    unit?: string;
    price?: number;
    quantity?: number;
    is_deduct_withholding_tax?: boolean;
    excise: Excise;
  }

  /**
   * Office
   * https://invoice.moneyforward.com/docs/api/v3/index.html#/schemas/Office
   */
  interface Office {
    id: string;
    name?: string;
    zip?: string;
    prefecture?: string;
    address1?: string;
    address2?: string;
    tel?: string;
    fax?: string;
    office_type?: string;
    office_code?: string;
    registration_code?: string;
    created_at: string;
    updated_at: string;
  }

  /**
   * Department
   * https://invoice.moneyforward.com/docs/api/v3/index.html#/schemas/Department
   */
  interface department {
    id: string;
    zip?: string;
    tel?: string;
    prefecture?: string;
    address1?: string;
    address2?: string;
    person_name?: string;
    person_title?: string;
    person_dept: string;
    email?: string;
    cc_emails?: string;
    office_member_id?: string;
    office_member_name?: string;
    created_at?: string;
    updated_at?: string;
  }

  /**
   * 取引先部署の作成のリクエストボディ
   */
  interface DepartmentReqBody {
    zip?: string;
    tel?: string;
    prefecture?: string;
    address1?: string;
    address2?: string;
    person_name?: string;
    person_title?: string;
    person_dept: string; // 担当者_部門は必須
    office_member_name?: string;
    email?: string;
    cc_emails?: string;
  }

  /**
   * Partner
   * https://invoice.moneyforward.com/docs/api/v3/index.html#/schemas/Partner
   */
  interface Partner {
    id: string;
    code?: string;
    name: string;
    name_kana?: string;
    name_suffix?: string;
    memo: string;
    created_at: string;
    updated_at: string;
    departments: Department[];
  }

  /**
   * 取引先作成のリクエストボディ
   */
  interface PartnerReqBody {
    code?: string;
    name: string;
    name_kana?: string;
    name_suffix?: string;
    memo?: string;
    departments?: DepartmentReqBody[];
  }

  /**
   * 取引先レスポンス
   */
  interface PartnersResponse {
    data: Partner[];
    pagination: PaginationData;
  }

  /**
   * 品目レスポンス
   */
  interface ItemsResponse {
    data: Item[];
    pagination: PaginationData;
  }
}
