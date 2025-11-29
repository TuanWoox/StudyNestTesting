import React, { useEffect, useState } from "react";
import {
    Button,
    Modal,
    Form,
    Input,
    Space,
    Skeleton,
    Tooltip,
    Select
} from "antd";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
import type { FilterDropdownProps, SortOrder } from "antd/es/table/interface";
import SettingsHeader from "./components/SettingsHeader";
import { useAntDesignTheme } from "@/hooks/common";
import useGetAllSetting from "@/hooks/settingHook/useGetAllSetting";
import useDeleteSetting from "@/hooks/settingHook/useDeleteSetting";
import useCreateSetting from "@/hooks/settingHook/useCreateSetting";
import useUpdateSetting from "@/hooks/settingHook/useUpdateSetting";
import ActionButtons from "@/features/user/notes/NoteEditor/components/ActionButtons";
import { UpdateSettingDTO } from "@/types/setting/updateSettingDTO";
import { CreateSettingDTO } from "@/types/setting/createSettingDTO";
import ModalConfirm from "@/components/ModalConfirm/ModalConfirm";
import { SortOrderType } from "@/constants/sortOrderType";
import { SettingDTO } from "@/types/setting/settingDTO";
import useDeleteSelectedSettings from "@/hooks/settingHook/useDeleteSelectedSettings";
import { Page } from "@/types/common/page";
import { useTableControls } from "@/hooks/common/useTableControls";
import SmartTable from "@/components/SmartTable/SmartTable";
import CustomFilterDropDown from "@/components/CustomFilterDropDown/CustomFilterDropDown";
import { getFilteredValue } from "@/utils/getFilteredValue";

const SettingsConfig: React.FC = () => {
    const { borderColor, shadowColor, bgColor, textColor } = useAntDesignTheme();

    /** ---------------- STATE ---------------- */
    const [total, setTotal] = useState(0);

    const [selectedRowKeys, setSelectedRowKeys] = useState<string[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isModalDeleteOpen, setIsModalDeleteOpen] = useState(false);
    const [isModalBulkDeleteOpen, setIsModalBulkDeleteOpen] = useState(false);
    const [editing, setEditing] = useState<any>(null);
    const [form] = Form.useForm();

    /** ---------------- DATA: GET SETTINGS ---------------- */
    const tableControls = useTableControls();

    const { data: settingData, isLoading, refetch } = useGetAllSetting({
        pageNumber: tableControls.pageNumber,
        pageSize: tableControls.pageSize,
        sorts: tableControls.sorts,
        filters: tableControls.filters,
    });

    /** Sync tổng số */
    useEffect(() => {
        if (settingData?.page?.totalElements != null) {
            setTotal(settingData.page.totalElements);
        }
    }, [settingData]);

    /** ---------------- HOOKS: CRUD ---------------- */
    const { createSetting, isLoading: creating } = useCreateSetting();
    const { updateSetting, isLoading: updating } = useUpdateSetting();
    const { deleteSetting, isLoading: deleting } = useDeleteSetting();
    const { deleteSettingsAsync, isLoading: selectedDeleting } = useDeleteSelectedSettings();

    /** ---------------- ACTIONS ---------------- */
    const openCreate = () => {
        setEditing(null);
        form.resetFields();
        form.setFieldsValue({ settingLevel: 0 }); // default
        setIsModalOpen(true);
    };

    const openEdit = (record: any) => {
        setEditing(record);
        form.setFieldsValue(record);
        setIsModalOpen(true);
    };

    const openDeleteConfirm = (record: any) => {
        setEditing(record);
        setIsModalDeleteOpen(true)
    }

    const handleModalOk = async () => {
        try {
            const values = await form.validateFields();

            if (editing) {
                const payload: UpdateSettingDTO = { id: editing.id, ...values };
                updateSetting(payload, { onSuccess: () => setIsModalOpen(false) });
            } else {
                const payload: CreateSettingDTO = { id: "", ...values };
                createSetting(payload, { onSuccess: () => setIsModalOpen(false) });
            }

        } catch (err: any) {
            console.error(err?.message ?? "Save failed");
        }
    };

    const handleDelete = (id: string) => {
        try {
            deleteSetting(id, { onSuccess: () => setIsModalDeleteOpen(false) });
            const currentPageItemCount = settingData?.data.length;
            const isLastItemOnPage = currentPageItemCount === 1;
            const isNotFirstPage = tableControls.pageNumber > 1;

            if (isLastItemOnPage && isNotFirstPage) {
                tableControls.setPageNumber(tableControls.pageNumber - 1);
            }
        } catch (error) {
            console.error("Delete failed", error);
        }
    };

    const handleBulkDelete = async () => {
        if (!selectedRowKeys.length) return;

        try {
            const payload: Page<string> = {
                size: selectedRowKeys.length,
                pageNumber: tableControls.pageNumber, // giữ trang hiện tại
                totalElements: selectedRowKeys.length,
                orders: [],
                filter: [],
                selected: selectedRowKeys,
            };

            // Gọi hook async
            await deleteSettingsAsync(payload);

            // Xác định tổng số item sau khi xóa
            const remainingItems = total - selectedRowKeys.length;

            // Tính page mới nếu cần
            const newPageNumber =
                remainingItems > 0
                    ? Math.min(tableControls.pageNumber, Math.floor((remainingItems - 1) / tableControls.pageSize))
                    : 0;

            tableControls.setPageNumber(newPageNumber);
            setSelectedRowKeys([]);
            setIsModalBulkDeleteOpen(false);
        } catch (error) {
            console.error("Bulk delete failed", error);
        }
    };

    // ----------------- FULL COLUMNS (typed) -----------------
    const columns: ColumnsType<SettingDTO> = [
        {
            title: "Key",
            dataIndex: "key",
            key: "key",
            width: 240,
            sorter: (a, b) => a.key.localeCompare(b.key),
            sortDirections: ["ascend", "descend"] as SortOrder[],
            filterDropdown: (props) => (
                <CustomFilterDropDown {...props} dataIndex="key" />
            ),
            filteredValue: getFilteredValue(tableControls.filters, "key"),
        },
        {
            title: "Group",
            dataIndex: "group",
            key: "group",
            width: 160,
            sorter: (a, b) => a.group.localeCompare(b.group),
            sortDirections: ["ascend", "descend"] as SortOrder[],
            filterDropdown: (props) => (
                <CustomFilterDropDown {...props} dataIndex="group" />
            ),
            filteredValue: getFilteredValue(tableControls.filters, "group")
        },
        {
            title: "Value",
            dataIndex: "value",
            key: "value",
            sorter: (a, b) => (a.value ?? "").localeCompare(b.value ?? ""),
            sortDirections: ["ascend", "descend"] as SortOrder[],
            filterDropdown: (props) => (
                <CustomFilterDropDown {...props} dataIndex="value" />
            ),
            filteredValue: getFilteredValue(tableControls.filters, "value"),
            render: (v: any) => {
                const text = String(v ?? "");
                const displayText = text.length > 50 ? text.slice(0, 50) + "..." : text;

                return (
                    <pre style={{ margin: 0, whiteSpace: "pre-wrap" }}>
                        {displayText}
                    </pre>
                );
            },
        },
        {
            title: "Description",
            dataIndex: "description",
            key: "description",
            sorter: (a, b) =>
                (a.description ?? "").localeCompare(b.description ?? ""),
            sortDirections: ["ascend", "descend"] as SortOrder[],
            filterDropdown: (props) => (
                <CustomFilterDropDown {...props} dataIndex="description" />
            ),
            filteredValue: getFilteredValue(tableControls.filters, "description"),
        },
        {
            title: "Level",
            dataIndex: "settingLevel",
            key: "settingLevel",
            width: 90,
        },
        {
            title: "Actions",
            key: "actions",
            width: 160,
            render: (_: any, record: SettingDTO) => (
                <Space>
                    <Tooltip title="Edit setting">
                        <Button
                            type="text"
                            icon={<EditOutlined />}
                            onClick={() => openEdit(record)}
                        />
                    </Tooltip>
                    <Tooltip title="Delete setting">
                        <Button
                            danger
                            type="text"
                            icon={<DeleteOutlined />}
                            onClick={() => openDeleteConfirm(record)}
                        />
                    </Tooltip>
                </Space>
            ),
        },
    ];

    /** ---------------- RENDER ---------------- */
    return (
        <div className="w-full h-full overflow-y-auto px-6 pt-4 pb-5"
            style={{
                backgroundColor: bgColor,
                scrollbarWidth: "none",
            }}>
            <SettingsHeader
                onRefresh={() => {
                    refetch();
                    tableControls.setSorts([
                        {
                            sort: "dateCreated",
                            sortDir: SortOrderType.DESC,
                        },
                    ]);
                }}
                onCreate={openCreate}
                selectedCount={selectedRowKeys.length}
                onBulkDelete={() => setIsModalBulkDeleteOpen(true)}
            />

            {/* Table */}
            {isLoading ? (
                <Skeleton active paragraph={{ rows: 6 }} />
            ) : (
                <SmartTable
                    columns={columns}
                    data={settingData?.data ?? []}
                    total={settingData?.page?.totalElements ?? 0}
                    loading={isLoading}
                    tableControls={tableControls}
                    rowSelection={{
                        selectedRowKeys,
                        onChange: setSelectedRowKeys,
                    }}
                    style={{
                        border: `2px solid ${borderColor}`,
                        boxShadow: `4px 4px 0px ${shadowColor}`,
                    }}
                />
            )}

            {/* Modal Create / Edit */}
            <Modal
                styles={{
                    mask: {
                        backgroundColor: "rgba(0,0,0,0.5)",
                        backdropFilter: "blur(4px)",
                    },
                    content: {
                        backgroundColor: bgColor,
                        border: `1px solid ${borderColor}`,
                        boxShadow: `4px 4px 0 ${shadowColor}`,
                        padding: 20,
                        fontFamily: '"Courier New", monospace',
                        color: textColor,
                    },
                }}
                open={isModalOpen}
                title={
                    <div
                        style={{
                            fontFamily: "'Courier New', monospace",
                            fontWeight: 700,
                            backgroundColor: bgColor,
                            display: "flex",
                            alignItems: "center",
                            gap: 8,
                        }}
                    >
                        {editing ? "Edit Setting" : "Create Setting"}
                    </div>
                }
                footer={null}
                onCancel={() => setIsModalOpen(false)}
                closable={false}
                maskClosable={false}
            >
                <Form form={form} layout="vertical">
                    <Form.Item name="key" label="Key" rules={[{ required: true }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item name="group" label="Group" rules={[{ required: true }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item name="value" label="Value" rules={[{ required: true }]}>
                        <Input.TextArea rows={4} />
                    </Form.Item>
                    <Form.Item name="description" label="Description" rules={[{ required: true }]}>
                        <Input.TextArea rows={2} />
                    </Form.Item>
                    <Form.Item
                        name="settingLevel"
                        label="Level"
                        rules={[{ required: true }]}
                    >
                        <Select
                            options={[
                                { label: "Normal (0) — Visible to UI", value: 0 },
                                { label: "System (1) — Hidden from UI", value: 1 },
                            ]}
                            style={{ width: "100%" }}
                        />
                    </Form.Item>

                </Form>

                <div className="mt-2 flex justify-end">
                    <ActionButtons
                        onSave={handleModalOk}
                        onClose={() => setIsModalOpen(false)}
                        isCreating={creating}
                        isUpdating={updating}
                        confirmBeforeClose={true}
                    />
                </div>
            </Modal>

            {/* Delete confirmation modal */}
            <ModalConfirm
                open={isModalDeleteOpen}
                title="Confirm Setting Deletion"
                content={
                    <>
                        Are you sure you want to{" "}
                        <b style={{ color: "#DC2626" }}>permanently delete</b> this setting?
                        <br />
                        This action cannot be undone.
                    </>
                }
                okText={deleting ? "Deleting..." : "Delete"}
                cancelText="Cancel"
                danger
                loading={deleting}
                onOk={() => handleDelete(editing.id)}
                onCancel={() => setIsModalDeleteOpen(false)}
            />

            {/* Delete selected settings confirmation modal */}
            <ModalConfirm
                open={isModalBulkDeleteOpen}
                title={`Delete ${selectedRowKeys.length} settings?`}
                content={
                    <>
                        Are you sure you want to <b style={{ color: "#DC2626" }}>permanently delete</b> these settings?
                        <br />
                        This action cannot be undone.
                    </>
                }
                okText="Delete"
                cancelText="Cancel"
                danger
                loading={selectedDeleting}
                onOk={handleBulkDelete}
                onCancel={() => setIsModalBulkDeleteOpen(false)}
            />

        </div>
    );
};

export default SettingsConfig;
