import { useAntDesignTheme } from "@/hooks/common";
import FeedBacksHeader from "./component/FeedbacksHeader";
import { ColumnsType } from "antd/es/table";
import { SortOrder } from "antd/es/table/interface";
import CustomFilterDropDown from "@/components/CustomFilterDropDown/CustomFilterDropDown";
import { getFilteredValue } from "@/utils/getFilteredValue";
import { useTableControls } from "@/hooks/common/useTableControls";
import { Button, Form, Skeleton, Space, Tag, Tooltip } from "antd";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { FeedBackDTO } from "@/types/feedback/feedBackDTO";
import useGetAllFeedBackHook from "@/hooks/feedbackHook/useGetAllFeedBackHook";
import SmartTable from "@/components/SmartTable/SmartTable";
import { useEffect, useState } from "react";
import useDeleteFeedBack from "@/hooks/feedbackHook/useDeleteFeedBack";
import ModalConfirm from "@/components/ModalConfirm/ModalConfirm";
import useDeleteSelectedFeedbacks from "@/hooks/feedbackHook/useDeleteSelectedFeedBacks";
import { Page } from "@/types/common/page";
import { SortOrderType } from "@/constants/sortOrderType";
import { EFeedBackStatus } from "@/utils/enums/EFeedBackStatus";
import FeedBackCreateEdit from "./component/FeedBackCreateEdit";
import useCreateFeedback from "@/hooks/feedbackHook/useCreateFeedBack";
import { CreateFeedBackDTO } from "@/types/feedback/createFeedBackDTO";
import useUpdateFeedback from "@/hooks/feedbackHook/useUpdateFeedBack";
import { UpdateFeedBackDTO } from "@/types/feedback/updateFeedBackDTO";

const Feedbacks = () => {
    const { borderColor, shadowColor, bgColor } = useAntDesignTheme();

    /** ---------------- STATE ---------------- */
    const [total, setTotal] = useState(0);
    const [selectedRowKeys, setSelectedRowKeys] = useState<string[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isModalDeleteOpen, setIsModalDeleteOpen] = useState(false);
    const [isModalBulkDeleteOpen, setIsModalBulkDeleteOpen] = useState(false);
    const [editing, setEditing] = useState<FeedBackDTO | null>(null);

    const [form] = Form.useForm();
    const tableControls = useTableControls();

    /** ---------------- DATA FETCH ---------------- */
    const { data: settingData, isLoading, refetch } = useGetAllFeedBackHook({
        pageNumber: tableControls.pageNumber,
        pageSize: tableControls.pageSize,
        sorts: tableControls.sorts,
        filters: tableControls.filters,
    });

    /** Sync total elements */
    useEffect(() => {
        if (settingData?.page?.totalElements != null) {
            setTotal(settingData.page.totalElements);
        }
    }, [settingData]);

    /** ---------------- HOOKS: CRUD ---------------- */
    const { createFeedback, isLoading: creating } = useCreateFeedback();
    const { deleteFeedback, isLoading: deleting } = useDeleteFeedBack();
    const { updateFeedback, isLoading: updating } = useUpdateFeedback();
    const { deleteFeedbacksAsync, isLoading: selectedDeleting } = useDeleteSelectedFeedbacks();

    /** ---------------- TABLE COLUMNS ---------------- */
    const columns: ColumnsType<FeedBackDTO> = [
        {
            title: "Category",
            dataIndex: "category",
            key: "category",
            width: 240,
            sorter: (a, b) => a.category.localeCompare(b.category),
            sortDirections: ["ascend", "descend"] as SortOrder[],
            filterDropdown: (props) => <CustomFilterDropDown {...props} dataIndex="key" />,
            filteredValue: getFilteredValue(tableControls.filters, "key"),
        },
        {
            title: "Rating",
            dataIndex: "rating",
            key: "rating",
            width: 160,
            sorter: (a, b) => a.rating - b.rating,
            sortDirections: ["ascend", "descend"] as SortOrder[],
        },
        {
            title: "Description",
            dataIndex: "description",
            key: "description",
            sorter: (a, b) => a.description.localeCompare(b.description),
            sortDirections: ["ascend", "descend"] as SortOrder[],
            filterDropdown: (props) => <CustomFilterDropDown {...props} dataIndex="group" />,
            filteredValue: getFilteredValue(tableControls.filters, "group"),
        },
        {
            title: "Status",
            dataIndex: "status",
            key: "status",
            sorter: (a, b) => a.status - b.status,
            sortDirections: ["ascend", "descend"] as SortOrder[],
            render: (status: EFeedBackStatus) => {
                let color = "default";
                let text = "";

                switch (status) {
                    case EFeedBackStatus.Pending:
                        color = "gold";
                        text = "Pending";
                        break;
                    case EFeedBackStatus.InQueue:
                        color = "blue";
                        text = "In Queue";
                        break;
                    case EFeedBackStatus.Done:
                        color = "green";
                        text = "Done";
                        break;
                    case EFeedBackStatus.Rejected:
                        color = "red";
                        text = "Rejected";
                        break;
                    default:
                        text = "Unknown";
                }

                return <Tag color={color}>{text}</Tag>;
            },
        },
        {
            title: "Actions",
            key: "actions",
            width: 160,
            render: (_: any, record: FeedBackDTO) => (
                <Space>
                    {record.status === EFeedBackStatus.Pending && (
                        <Space>
                            <Tooltip title="Edit Feedback">
                                <Button
                                    type="text"
                                    icon={<EditOutlined />}
                                    onClick={() => openEdit(record)}
                                />
                            </Tooltip>
                            <Tooltip title="Delete Feedback">
                                <Button
                                    danger
                                    type="text"
                                    icon={<DeleteOutlined />}
                                    onClick={() => openDeleteConfirm(record)}
                                />
                            </Tooltip>
                        </Space>
                    )}
                </Space>
            ),
        },
    ];

    /** ---------------- CRUD HANDLERS ---------------- */
    const handleDelete = (id: string) => {
        try {
            deleteFeedback(id, { onSuccess: () => setIsModalDeleteOpen(false) });

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

    const openDeleteConfirm = (record: FeedBackDTO) => {
        setEditing(record);
        setIsModalDeleteOpen(true);
    };

    const handleBulkDelete = async () => {
        if (!selectedRowKeys.length) return;

        try {
            const payload: Page<string> = {
                size: selectedRowKeys.length,
                pageNumber: tableControls.pageNumber,
                totalElements: selectedRowKeys.length,
                orders: [],
                filter: [],
                selected: selectedRowKeys,
            };

            await deleteFeedbacksAsync(payload);

            const remainingItems = total - selectedRowKeys.length;
            const newPageNumber =
                remainingItems > 0
                    ? Math.min(
                        tableControls.pageNumber,
                        Math.floor((remainingItems - 1) / tableControls.pageSize)
                    )
                    : 0;

            tableControls.setPageNumber(newPageNumber);
            setSelectedRowKeys([]);
            setIsModalBulkDeleteOpen(false);
        } catch (error) {
            console.error("Bulk delete failed", error);
        }
    };

    const handleModalOk = async () => {
        try {
            const values = await form.validateFields();

            if (editing) {
                const payload: UpdateFeedBackDTO = { id: editing.id, ...values };
                updateFeedback(payload, { onSuccess: () => setIsModalOpen(false) });
            } else {
                const payload: CreateFeedBackDTO = { id: "", ...values };
                createFeedback(payload, { onSuccess: () => setIsModalOpen(false) });
            }
        } catch (err: any) {
            console.error(err?.message ?? "Save failed");
        }
    };

    const openCreate = () => {
        setEditing(null);
        form.resetFields();
        form.setFieldsValue({ settingLevel: 0 }); // default
        setIsModalOpen(true);
    };

    const openEdit = (record: any) => {
        console.log(record);
        setEditing(record);
        form.setFieldsValue(record);
        setIsModalOpen(true);
    };

    /** ---------------- RENDER ---------------- */
    return (
        <div
            className="w-full h-full overflow-y-auto px-6 pt-4 pb-5"
            style={{ backgroundColor: bgColor, scrollbarWidth: "none" }}
        >
            <FeedBacksHeader
                onRefresh={() => {
                    refetch();
                    tableControls.setSorts([{ sort: "dateCreated", sortDir: SortOrderType.DESC }]);
                }}
                onCreate={openCreate}
                selectedCount={selectedRowKeys.length}
                onBulkDelete={() => setIsModalBulkDeleteOpen(true)}
            />

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

            <FeedBackCreateEdit
                open={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSave={handleModalOk}
                isCreating={creating}
                isUpdating={false}
                editing={editing}
                form={form}
            />

            {/* Delete confirmation modal */}
            <ModalConfirm
                open={isModalDeleteOpen}
                title="Confirm Setting Deletion"
                content={
                    <>
                        Are you sure you want to <b style={{ color: "#DC2626" }}>permanently delete</b> this
                        feedback?
                        <br />
                        This action cannot be undone.
                    </>
                }
                okText={deleting ? "Deleting..." : "Delete"}
                cancelText="Cancel"
                danger
                loading={deleting}
                onOk={() => handleDelete(editing!.id)}
                onCancel={() => setIsModalDeleteOpen(false)}
            />

            {/* Bulk delete confirmation modal */}
            <ModalConfirm
                open={isModalBulkDeleteOpen}
                title={`Delete ${selectedRowKeys.length} settings?`}
                content={
                    <>
                        Are you sure you want to <b style={{ color: "#DC2626" }}>permanently delete</b>{" "}
                        these feedbacks?
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

export default Feedbacks;
