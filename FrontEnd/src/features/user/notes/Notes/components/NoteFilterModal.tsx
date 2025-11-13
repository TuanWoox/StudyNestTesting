// import React, { useEffect, useState } from "react";
// import { Modal, Select, Divider, Space, Button, theme } from "antd";
// import {
//     FilterOutlined,
//     FolderOutlined,
//     TagOutlined,
//     SortAscendingOutlined,
//     SortDescendingOutlined,
// } from "@ant-design/icons";
// import type { Folder, Tag } from "@/types/note/notes";

// interface Props {
//     open: boolean;
//     // folders: Folder[];
//     // tags: Tag[];
//     // defaultFolderId?: string | null;
//     // defaultTagIds?: string[];
//     defaultSortBy?: string; // "dateCreated" | "dateModified" | "title"
//     defaultSortOrder?: "ASC" | "DESC";
//     onCancel: () => void;
//     onApply: (payload: {
//         // folderId?: string | null;
//         // tagIds?: string[];
//         sortBy?: string;
//         sortOrder?: "ASC" | "DESC";
//     }) => void;
// }

// const NoteFilterModal: React.FC<Props> = ({
//     open,
//     // folders,
//     // tags,
//     // defaultFolderId = null,
//     // defaultTagIds = [],
//     defaultSortBy = "dateCreated",
//     defaultSortOrder = "DESC",
//     onCancel,
//     onApply,
// }) => {
//     const { token } = theme.useToken();
//     // const [folderId, setFolderId] = useState<string | null>(defaultFolderId ?? null);
//     // const [tagIds, setTagIds] = useState<string[]>(defaultTagIds ?? []);
//     const [sortBy, setSortBy] = useState<string>(defaultSortBy);
//     const [sortOrder, setSortOrder] = useState<"ASC" | "DESC">(defaultSortOrder);

//     useEffect(() => {
//         // setFolderId(defaultFolderId ?? null);
//         // setTagIds(defaultTagIds ?? []);
//         setSortBy(defaultSortBy);
//         setSortOrder(defaultSortOrder);
//     }, [
//         // defaultFolderId, defaultTagIds, 
//         defaultSortBy, defaultSortOrder, open]);

//     const borderColor = `${token.colorPrimary}55`;
//     const shadowColor = `${token.colorPrimary}55`;
//     const backgroundColor = token.colorBgElevated;

//     return (
//         <Modal
//             open={open}
//             title={
//                 <div
//                     style={{
//                         display: "flex",
//                         alignItems: "center",
//                         gap: 10,
//                         fontFamily: "'Courier New', monospace",
//                         fontWeight: 700,
//                         fontSize: 20,
//                         background: backgroundColor,
//                     }}
//                 >
//                     <FilterOutlined /> Filter & Sort Notes
//                 </div>
//             }
//             centered
//             onCancel={onCancel}
//             footer={[
//                 <Button
//                     key="clear"
//                     onClick={() => {
//                         // setFolderId(null);
//                         // setTagIds([]);
//                         setSortBy("dateCreated");
//                         setSortOrder("DESC");
//                     }}
//                     style={{
//                         borderColor,
//                         boxShadow: `2px 2px 0 ${shadowColor}`,
//                         fontFamily: '"Courier New", monospace',
//                     }}
//                 >
//                     Clear
//                 </Button>,
//                 <Button
//                     key="cancel"
//                     onClick={onCancel}
//                     style={{
//                         fontFamily: '"Courier New", monospace',
//                         borderColor,
//                         boxShadow: `2px 2px 0 ${shadowColor}`,
//                     }}
//                 >
//                     Cancel
//                 </Button>,
//                 <Button
//                     key="apply"
//                     type="primary"
//                     onClick={() =>
//                         onApply({
//                             // folderId: folderId ?? undefined,
//                             // tagIds: tagIds.length ? tagIds : undefined,
//                             sortBy,
//                             sortOrder,
//                         })
//                     }
//                     style={{
//                         fontFamily: '"Courier New", monospace',
//                         fontWeight: 600,
//                         boxShadow: `2px 2px 0 ${token.colorPrimaryBorder}`,
//                         transition: "all 0.25s ease",
//                     }}
//                 >
//                     Apply
//                 </Button>,
//             ]}
//             closable={false}
//             styles={{
//                 mask: {
//                     backgroundColor: "rgba(0,0,0,0.5)",
//                     backdropFilter: "blur(4px)",
//                 },
//                 content: {
//                     backgroundColor,
//                     border: `1px solid ${borderColor}`,
//                     boxShadow: `4px 4px 0 ${shadowColor}`,
//                     padding: "28px 30px",
//                     fontFamily: '"Courier New", monospace',
//                     transition: "all 0.3s ease",
//                 },
//             }}
//         >
//             <Space direction="vertical" style={{ width: "100%" }} size="large">
//                 {/* Folder filter */}
//                 {/* <div>
//                     <Divider
//                         orientation="left"
//                         orientationMargin="0"
//                         style={{
//                             fontWeight: 700,
//                             color: token.colorTextHeading,
//                             borderColor,
//                         }}
//                     >
//                         <FolderOutlined /> Folder Filter
//                     </Divider>
//                     <Select
//                         allowClear
//                         value={folderId ?? undefined}
//                         onChange={(v) => setFolderId(v ?? null)}
//                         placeholder="Select a folder..."
//                         style={{
//                             width: "100%",
//                             borderRadius: 6,
//                             boxShadow: `2px 2px 0 ${shadowColor}`,
//                         }}
//                         options={folders.map((f) => ({
//                             value: f.id,
//                             label: f.folderName,
//                         }))}
//                     />
//                 </div> */}

//                 {/* Tag filter */}
//                 {/* <div>
//                     <Divider
//                         orientation="left"
//                         orientationMargin="0"
//                         style={{
//                             fontWeight: 700,
//                             color: token.colorTextHeading,
//                             borderColor,
//                         }}
//                     >
//                         <TagOutlined /> Tag Filter
//                     </Divider>
//                     <Select
//                         mode="multiple"
//                         allowClear
//                         placeholder="Select tags..."
//                         value={tagIds}
//                         onChange={(v: string[]) => setTagIds(v)}
//                         style={{
//                             width: "100%",
//                             boxShadow: `2px 2px 0 ${shadowColor}`,
//                         }}
//                         options={tags.map((t) => ({
//                             value: t.id,
//                             label: t.name,
//                         }))}
//                     />
//                 </div> */}

//                 {/* Sort section */}
//                 <div>
//                     <Divider
//                         orientation="left"
//                         orientationMargin="0"
//                         style={{
//                             fontWeight: 700,
//                             color: token.colorTextHeading,
//                             borderColor,
//                         }}
//                     >
//                         {sortOrder === "ASC" ? (
//                             <SortAscendingOutlined />
//                         ) : (
//                             <SortDescendingOutlined />
//                         )}{" "}
//                         Sort Notes
//                     </Divider>
//                     <Space style={{ width: "100%" }} direction="vertical" size="middle">
//                         <Select
//                             value={sortBy}
//                             onChange={(v) => setSortBy(v)}
//                             style={{ width: "100%", boxShadow: `2px 2px 0 ${shadowColor}` }}
//                             options={[
//                                 { value: "dateCreated", label: "Date Created" },
//                                 { value: "dateModified", label: "Date Modified" },
//                                 { value: "title", label: "Title" },
//                             ]}
//                         />
//                         <Select
//                             value={sortOrder}
//                             onChange={(v) => setSortOrder(v)}
//                             style={{ width: "100%", boxShadow: `2px 2px 0 ${shadowColor}` }}
//                             options={[
//                                 { value: "ASC", label: "Ascending (A → Z / Oldest)" },
//                                 { value: "DESC", label: "Descending (Z → A / Newest)" },
//                             ]}
//                         />
//                     </Space>
//                 </div>
//             </Space>
//         </Modal>
//     );
// };

// export default NoteFilterModal;

import React, { useEffect, useState } from "react";
import { Modal, Select, Divider, Space, Button, DatePicker, theme, Grid } from "antd";
import {
    FilterOutlined,
    SortAscendingOutlined,
    SortDescendingOutlined,
    CalendarOutlined,
} from "@ant-design/icons";
import dayjs, { Dayjs } from "dayjs";

const { useBreakpoint } = Grid;

const disabledDate = (current?: Dayjs) => {
    if (!current) return false;
    return current.isAfter(dayjs(), "day"); // không chọn ngày tương lai
};

interface Props {
    open: boolean;
    defaultSortBy?: string; // "dateCreated" | "dateModified" | "title"
    defaultSortOrder?: "ASC" | "DESC";
    defaultCreatedRange?: [Dayjs | null, Dayjs | null] | undefined;
    defaultModifiedRange?: [Dayjs | null, Dayjs | null] | undefined;
    onCancel: () => void;
    onApply: (payload: {
        sortBy?: string;
        sortOrder?: "ASC" | "DESC";
        createdRange?: [Dayjs | null, Dayjs | null];
        modifiedRange?: [Dayjs | null, Dayjs | null];
    }) => void;
}

const NoteFilterModal: React.FC<Props> = ({
    open,
    defaultSortBy = "dateCreated",
    defaultSortOrder = "DESC",
    defaultCreatedRange,
    defaultModifiedRange,
    onCancel,
    onApply,
}) => {
    const { token } = theme.useToken();
    const screens = useBreakpoint();
    const pickerSize: "small" | "middle" | "large" = screens.md ? "middle" : "small";

    const [sortBy, setSortBy] = useState<string>(defaultSortBy);
    const [sortOrder, setSortOrder] = useState<"ASC" | "DESC">(defaultSortOrder);
    const [createdRange, setCreatedRange] = useState<[Dayjs | null, Dayjs | null]>(defaultCreatedRange ?? [null, null]);
    const [modifiedRange, setModifiedRange] = useState<[Dayjs | null, Dayjs | null]>(defaultModifiedRange ?? [null, null]);

    useEffect(() => {
        setSortBy(defaultSortBy);
        setSortOrder(defaultSortOrder);
        setCreatedRange(defaultCreatedRange ?? [null, null]);
        setModifiedRange(defaultModifiedRange ?? [null, null]);
    }, [defaultSortBy, defaultSortOrder, defaultCreatedRange, defaultModifiedRange, open]);

    const borderColor = `${token.colorPrimary}55`;
    const shadowColor = `${token.colorPrimary}55`;
    const backgroundColor = token.colorBgElevated;

    return (
        <Modal
            open={open}
            title={
                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 10,
                        fontFamily: "'Courier New', monospace",
                        fontWeight: 700,
                        fontSize: 20,
                        background: backgroundColor,
                    }}
                >
                    <FilterOutlined /> Filter & Sort Notes
                </div>
            }
            centered
            onCancel={onCancel}
            footer={[
                <Button
                    key="clear"
                    onClick={() => {
                        setSortBy("dateCreated");
                        setSortOrder("DESC");
                        setCreatedRange([null, null]);
                        setModifiedRange([null, null]);
                    }}
                    style={{
                        borderColor,
                        boxShadow: `2px 2px 0 ${shadowColor}`,
                        fontFamily: '"Courier New", monospace',
                    }}
                >
                    Clear
                </Button>,
                <Button
                    key="cancel"
                    onClick={onCancel}
                    style={{
                        fontFamily: '"Courier New", monospace',
                        borderColor,
                        boxShadow: `2px 2px 0 ${shadowColor}`,
                    }}
                >
                    Cancel
                </Button>,
                <Button
                    key="apply"
                    type="primary"
                    onClick={() =>
                        onApply({
                            sortBy,
                            sortOrder,
                            createdRange,
                            modifiedRange,
                        })
                    }
                    style={{
                        fontFamily: '"Courier New", monospace',
                        fontWeight: 600,
                        boxShadow: `2px 2px 0 ${token.colorPrimaryBorder}`,
                        transition: "all 0.25s ease",
                    }}
                >
                    Apply
                </Button>,
            ]}
            closable={false}
            styles={{
                mask: {
                    backgroundColor: "rgba(0,0,0,0.5)",
                    backdropFilter: "blur(4px)",
                },
                content: {
                    backgroundColor,
                    border: `1px solid ${borderColor}`,
                    boxShadow: `4px 4px 0 ${shadowColor}`,
                    padding: "28px 30px",
                    fontFamily: '"Courier New", monospace',
                    transition: "all 0.3s ease",
                },
            }}
        >
            <Space direction="vertical" style={{ width: "100%" }} size="large">
                {/* Created Date Filter */}
                <div>
                    <Divider
                        orientation="left"
                        orientationMargin="0"
                        style={{
                            fontWeight: 700,
                            borderColor,
                        }}
                    >
                        <CalendarOutlined /> Filter by Date Created
                    </Divider>
                    {screens.md ? (
                        // Desktop: RangePicker
                        <DatePicker.RangePicker
                            value={createdRange}
                            disabledDate={disabledDate}
                            size={pickerSize}
                            onChange={(values) => setCreatedRange((values as [Dayjs | null, Dayjs | null]) ?? [null, null])}
                            style={{ width: "100%", boxShadow: `2px 2px 0 ${shadowColor}` }}
                            format="YYYY-MM-DD"
                            allowClear
                        />
                    ) : (
                        // Mobile: two DatePickers
                        <Space direction="vertical" style={{ width: "100%" }}>
                            <DatePicker
                                placeholder="Start Date"
                                value={createdRange[0]}
                                disabledDate={disabledDate}
                                size={pickerSize}
                                onChange={(d) => setCreatedRange([d, createdRange[1]])}
                                style={{ width: "100%", boxShadow: `2px 2px 0 ${shadowColor}` }}
                                format="YYYY-MM-DD"
                            />
                            <DatePicker
                                placeholder="End Date"
                                value={createdRange[1]}
                                disabledDate={disabledDate}
                                size={pickerSize}
                                onChange={(d) => setCreatedRange([createdRange[0], d])}
                                style={{ width: "100%", boxShadow: `2px 2px 0 ${shadowColor}` }}
                                format="YYYY-MM-DD"
                            />
                        </Space>
                    )}
                </div>

                {/* Modified Date Filter */}
                <div>
                    <Divider
                        orientation="left"
                        orientationMargin="0"
                        style={{
                            fontWeight: 700,
                            borderColor,
                        }}
                    >
                        <CalendarOutlined /> Filter by Date Modified
                    </Divider>
                    {screens.md ? (
                        <DatePicker.RangePicker
                            value={modifiedRange}
                            disabledDate={disabledDate}
                            size={pickerSize}
                            onChange={(values) => setModifiedRange((values as [Dayjs | null, Dayjs | null]) ?? [null, null])}
                            style={{ width: "100%", boxShadow: `2px 2px 0 ${shadowColor}` }}
                            format="YYYY-MM-DD"
                            allowClear
                        />
                    ) : (
                        <Space direction="vertical" style={{ width: "100%" }}>
                            <DatePicker
                                placeholder="Start Date"
                                value={modifiedRange[0]}
                                disabledDate={disabledDate}
                                size={pickerSize}
                                onChange={(d) => setModifiedRange([d, modifiedRange[1]])}
                                style={{ width: "100%", boxShadow: `2px 2px 0 ${shadowColor}` }}
                                format="YYYY-MM-DD"
                            />
                            <DatePicker
                                placeholder="End Date"
                                value={modifiedRange[1]}
                                disabledDate={disabledDate}
                                size={pickerSize}
                                onChange={(d) => setModifiedRange([modifiedRange[0], d])}
                                style={{ width: "100%", boxShadow: `2px 2px 0 ${shadowColor}` }}
                                format="YYYY-MM-DD"
                            />
                        </Space>
                    )}
                </div>

                {/* Sort Section */}
                <div>
                    <Divider
                        orientation="left"
                        orientationMargin="0"
                        style={{
                            fontWeight: 700,
                            borderColor,
                        }}
                    >
                        {sortOrder === "ASC" ? (
                            <SortAscendingOutlined />
                        ) : (
                            <SortDescendingOutlined />
                        )}{" "}
                        Sort Notes
                    </Divider>
                    <Space style={{ width: "100%" }} direction="vertical" size="middle">
                        <Select
                            value={sortBy}
                            onChange={(v) => setSortBy(v)}
                            style={{ width: "100%", boxShadow: `2px 2px 0 ${shadowColor}` }}
                            options={[
                                { value: "dateCreated", label: "Date Created" },
                                { value: "dateModified", label: "Date Modified" },
                                { value: "title", label: "Title" },
                            ]}
                        />
                        <Select
                            value={sortOrder}
                            onChange={(v) => setSortOrder(v)}
                            style={{ width: "100%", boxShadow: `2px 2px 0 ${shadowColor}` }}
                            options={[
                                { value: "ASC", label: "Ascending (A → Z / Oldest)" },
                                { value: "DESC", label: "Descending (Z → A / Newest)" },
                            ]}
                        />
                    </Space>
                </div>
            </Space>
        </Modal>
    );
};

export default NoteFilterModal;
