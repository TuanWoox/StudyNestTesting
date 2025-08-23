
export enum SortOrderType {
    ASC = 'ASC',
    DESC = 'DESC'
}

export interface OrderMapping {
    sort: string;
    sortDir: SortOrderType;
    dynamicProperty: string;
    delimiter: string;
    dataType: string;
}

export enum StudyNestFilterType {
    Text = 'Text',
    Number = 'Number',
    DateTime = 'DateTime',
    DropDown = 'DropDown',
    Boolean = 'Boolean',
    Date = 'Date',
    DropDownList = 'DropDownList',
    DynamicContent = 'DynamicContent',
    EmailActions = 'EmailActions'
}

export interface FilterMapping {
    prop: string;
    value: any;
    filterOperator: any;
    filterType: StudyNestFilterType;
    dynamicProperty: string;
    delimiter: string;
}

export interface Page<T> {
    size: number;
    pageNumber: number;
    totalElements: number;
    orders: OrderMapping[];
    filter: FilterMapping[];
    selected: T[];
}
