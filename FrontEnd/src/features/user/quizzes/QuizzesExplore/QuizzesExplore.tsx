import React, { useRef, useState } from "react";
import { theme } from "antd";
import { EmptyState } from "@/components/EmptyState/EmptyState";
import useExplorePublicQuizzes from "@/hooks/quizHook/useExplorePublicQuizzes";
import useForkQuiz from "@/hooks/quizHook/useForkQuiz";
import useDebounce from "@/hooks/common/useDebounce";
import { SortOrderType } from "@/constants/sortOrderType";
import { Dayjs } from "dayjs";
import { QuizDetail } from "@/types/quiz/quiz";
import QuizExploreHeader from "./components/QuizExploreHeader";
import QuizExploreSearchControls from "./components/QuizExploreSearchControls";
import QuizExploreGrid from "./components/QuizExploreGrid";
import QuizExplorePagination from "./components/QuizExplorePagination";
import QuizExploreFilterModal from "./components/QuizExploreFilterModal";
import QuizDetailModal from "./components/QuizDetailModal";
import ForkQuizModal, { QuizForkModalRef } from "./components/QuizForkModal";

const { useToken } = theme;

const QuizzesExplore: React.FC = () => {
    const { token } = useToken();

    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(9);
    const [searchTerm, setSearchTerm] = useState("");
    const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
    const [isForkingId, setIsForkingId] = useState<string | null>(null);
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
    const [selectedQuiz, setSelectedQuiz] = useState<QuizDetail | null>(null);

    // Filter & Sort states
    const [createdFilterRange, setCreatedFilterRange] = useState<[Dayjs | null, Dayjs | null]>([null, null]);
    const [sortField, setSortField] = useState<"dateCreated" | "title">("dateCreated");
    const [sortOrder, setSortOrder] = useState<SortOrderType>(SortOrderType.DESC);
    const [difficulty, setDifficulty] = useState<string | undefined>(undefined);

    const debouncedSearchTerm = useDebounce(searchTerm, 500);

    const {
        data: quizData,
        isPending,
        isError,
        error,
        refetch,
    } = useExplorePublicQuizzes({
        pageNumber: page - 1,
        pageSize,
        searchTerm: debouncedSearchTerm,
        sortField,
        sortOrder,
        createdRange: createdFilterRange,
        difficulty,
    });

    const { mutateAsync: forkQuizAsync, isPending: isForking } = useForkQuiz();
    const forkQuizModalRef = useRef<QuizForkModalRef>(null);

    const quizzes = quizData?.data || [];
    const totalElements = quizData?.page.totalElements || 0;

    const handleTableChange = (newPage: number, newPageSize: number) => {
        setPage(newPage);
        setPageSize(newPageSize);
    };

    const handleFork = async (quizId: string) => {
        try {
            setIsForkingId(quizId);
            await forkQuizAsync(quizId);
        } catch (err) {
            console.error("Failed to fork quiz:", err);
        } finally {
            setIsForkingId(null);
        }
    };

    const handleViewDetails = (quiz: QuizDetail) => {
        setSelectedQuiz(quiz);
        setIsDetailModalOpen(true);
    };

    if (isError || (!isPending && !quizData)) {
        return (
            <div style={{ padding: "24px", width: "100%" }}>
                <EmptyState
                    type="error"
                    title="Failed to Load Public Quizzes"
                    description={error?.message || "Unable to load public quiz list. Please try again."}
                    actionLabel="Try Again"
                    onAction={() => refetch()}
                />
            </div>
        );
    }

    return (
        <div
            style={{
                padding: "16px 24px",
                paddingBottom: "80px",
                width: "100%",
                minHeight: "100vh",
                overflow: "auto",
                backgroundColor: token.colorBgLayout,
                scrollbarWidth: "none",
            }}
        >
            <div style={{ width: "100%" }}>
                <QuizExploreHeader />

                <QuizExploreSearchControls
                    searchTerm={searchTerm}
                    onSearchChange={setSearchTerm}
                    onOpenFilter={() => setIsFilterModalOpen(true)}
                    onForkQuiz={() => forkQuizModalRef.current?.open()}
                />

                <QuizExploreGrid
                    quizzes={quizzes}
                    isPending={isPending}
                    pageSize={pageSize}
                    onFork={handleFork}
                    onViewDetails={handleViewDetails}
                    isForkingId={isForkingId}
                    isForking={isForking}
                />

                {totalElements > 0 && (
                    <QuizExplorePagination
                        current={page}
                        pageSize={pageSize}
                        total={totalElements}
                        onChange={handleTableChange}
                    />
                )}
            </div>

            <QuizExploreFilterModal
                open={isFilterModalOpen}
                defaultSortBy={sortField}
                defaultSortOrder={sortOrder}
                defaultCreatedRange={createdFilterRange}
                defaultDifficulty={difficulty || "all"}
                onCancel={() => setIsFilterModalOpen(false)}
                onApply={({ sortBy, sortOrder: order, createdRange, difficulty: diff }) => {
                    setSortField((sortBy as "dateCreated" | "title") ?? "dateCreated");
                    setSortOrder((order as SortOrderType) ?? SortOrderType.DESC);
                    setCreatedFilterRange(createdRange ?? [null, null]);
                    setDifficulty(diff);
                    setPage(1);
                    setIsFilterModalOpen(false);
                }}
            />

            <QuizDetailModal
                visible={isDetailModalOpen}
                quiz={selectedQuiz}
                onClose={() => {
                    setIsDetailModalOpen(false);
                    setSelectedQuiz(null);
                }}
                onFork={handleFork}
                isForkingId={isForkingId}
                isForking={isForking}
            />

            <ForkQuizModal ref={forkQuizModalRef} />
        </div>
    );
};

export default QuizzesExplore;
