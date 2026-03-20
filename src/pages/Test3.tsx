import React, { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { useVirtualizer } from "@tanstack/react-virtual";

// 类型定义
interface Character {
  id: number;
  name: string;
  description: string;
  static_avatar_url: string;
}

interface ApiResponse {
  code: number;
  data: Character[];
}

// 常量配置
const CONFIG = {
  PAGE_SIZE: 20,
  MAX_PAGE: 20,
  ROW_HEIGHT: 280,
  OVERSCAN: 3,
  DEBOUNCE_DELAY: 200,
} as const;

// 响应式断点配置
const BREAKPOINTS = [
  { width: 1280, columns: 6 },
  { width: 768, columns: 4 },
  { width: 640, columns: 3 },
] as const;

// 获取列数
const getColumnsCount = (width: number): number => {
  for (const bp of BREAKPOINTS) {
    if (width >= bp.width) return bp.columns;
  }
  return 2;
};

// 防抖函数
const debounce = <T extends (...args: unknown[]) => void>(fn: T, delay: number) => {
  let timer: ReturnType<typeof setTimeout>;
  return (...args: Parameters<T>) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
};

// 模拟 API
const getCharacterList = async (page: number, size: number): Promise<ApiResponse> => {
  await new Promise((resolve) => setTimeout(resolve, 500));

  if (page > CONFIG.MAX_PAGE) {
    return { code: 200, data: [] };
  }

  const data: Character[] = Array.from({ length: size }, (_, i) => {
    const id = (page - 1) * size + i + 1;
    return {
      id,
      name: `角色 ${id}`,
      description: `这是角色 ${id} 的描述信息`,
      static_avatar_url: `https://picsum.photos/300/400?random=${id}`,
    };
  });

  return { code: 200, data };
};

// 卡片组件
const CharacterCard: React.FC<{ item: Character }> = React.memo(({ item }) => (
  <div className="relative w-full rounded-lg overflow-hidden" style={{ paddingTop: "133.333%" }}>
    <div className="absolute inset-0">
      <img className="w-full h-full object-cover" src={item.static_avatar_url} alt={item.name} />
    </div>
    <div className="absolute bottom-0 left-0 right-0 p-4 pt-12 text-white bg-gradient-to-t from-[rgba(22,24,35,0.5)] to-transparent">
      <div className="font-bold text-base">{item.name}</div>
      <div className="text-xs truncate">{item.description}</div>
    </div>
  </div>
));

CharacterCard.displayName = "CharacterCard";

// 加载状态组件
const LoadingSpinner: React.FC = () => (
  <div className="m-8 text-center">
    <div className="inline-block w-6 h-6 border-2 border-black border-t-transparent rounded-full animate-spin" />
  </div>
);

// 主组件
const Test3: React.FC = () => {
  const [dataList, setDataList] = useState<Character[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [columns, setColumns] = useState(() => getColumnsCount(window.innerWidth));
  const containerRef = useRef<HTMLDivElement>(null);

  // 防抖更新列数
  useEffect(() => {
    const handleResize = debounce(() => {
      setColumns(getColumnsCount(window.innerWidth));
    }, CONFIG.DEBOUNCE_DELAY);

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // 数据分组为行
  const rows = useMemo(() => {
    const result: Character[][] = [];
    for (let i = 0; i < dataList.length; i += columns) {
      result.push(dataList.slice(i, i + columns));
    }
    return result;
  }, [dataList, columns]);

  // 虚拟滚动
  const virtualizer = useVirtualizer({
    count: rows.length,
    getScrollElement: () => containerRef.current,
    estimateSize: () => CONFIG.ROW_HEIGHT,
    overscan: CONFIG.OVERSCAN,
  });

  const virtualItems = virtualizer.getVirtualItems();
  const totalHeight = virtualizer.getTotalSize();

  // 加载数据
  const loadData = useCallback(async (targetPage: number) => {
    if (isLoading || !hasMore) return;

    setIsLoading(true);
    try {
      const res = await getCharacterList(targetPage, CONFIG.PAGE_SIZE);

      if (res.code !== 200 || !res.data?.length) {
        setHasMore(false);
        return;
      }

      setDataList((prev) => (targetPage === 1 ? res.data : [...prev, ...res.data]));
      setPage(targetPage);
    } finally {
      setIsLoading(false);
    }
  }, [isLoading, hasMore]);

  // 初始加载
  useEffect(() => {
    loadData(1);
  }, []);

  // 滚动加载更多
  useEffect(() => {
    const lastItem = virtualItems[virtualItems.length - 1];
    if (!lastItem) return;

    if (lastItem.index >= rows.length - 1 && !isLoading && hasMore) {
      loadData(page + 1);
    }
  }, [virtualItems, rows.length, isLoading, hasMore, page, loadData]);

  return (
    <main ref={containerRef} className="h-screen w-full bg-[#f5f7fa] p-4 overflow-auto">
      <div style={{ height: totalHeight, position: "relative" }}>
        {virtualItems.map((virtualRow) => (
          <div
            key={virtualRow.key}
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              transform: `translateY(${virtualRow.start}px)`,
            }}
            className="grid gap-6 gap-x-4 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-6"
          >
            {rows[virtualRow.index]?.map((item) => (
              <CharacterCard key={item.id} item={item} />
            ))}
          </div>
        ))}
      </div>

      {isLoading && <LoadingSpinner />}

      {!hasMore && dataList.length > 0 && (
        <div className="m-8 text-center text-gray-500 text-sm">没有更多数据了</div>
      )}
    </main>
  );
};

export default Test3;
