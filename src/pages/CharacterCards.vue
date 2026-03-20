<template>
  <main class="character-area">
    <div
      class="character-content"
      v-infinite-scroll="loadMoreDataList"
      :infinite-scroll-delay="100"
      :infinite-scroll-distance="300"
      :infinite-scroll-disabled="pageData.disabledInfinite"
    >
      <div class="character-item" v-for="item in dataList" :key="item.id">
        <div class="item-content">
          <img
            class="item-img"
            :src="item.static_avatar_url"
            alt="Character Image"
          />
        </div>
        <div class="item-info">
          <div class="item-title">{{ item.name }}</div>
          <div class="item-description">{{ item.description }}</div>
        </div>
      </div>
    </div>
    <div
      v-if="pageData.isLoadingMoreData == false && dataList.length === 0"
      class="mt-[24px] mb-[48px] flex flex-col items-center justify-center"
    >
      <div class="text-[#595A5F] text-[14px]">暂无数据</div>
    </div>
    <div
      v-if="pageData.isLoadingMoreData"
      class="loading-wrapper m-[30px] text-center"
    >
      <el-icon class="is-loading" :size="24" color="#000000">
        <Loading />
      </el-icon>
    </div>
    <div
      v-if="pageData.showLoadMore && !pageData.isLoadingMoreData"
      class="load-more-btn-wrapper text-center mt-[24px] mb-[48px]"
    >
      <el-button type="primary" @click="handleLoadMore" size="large"
        >Load More</el-button
      >
    </div>
  </main>
</template>

<script setup>
import {
  ref,
  reactive,
  onMounted,
  computed,
  onBeforeUnmount,
  defineEmits,
  watch,
} from "vue";
import { Loading } from "@element-plus/icons-vue";
import { getCharacterList } from "@/api/index.js";
const dataList = ref([]);
let pageData = reactive({
  isLoadingMoreData: false,
  page: 1,
  size: 10,
  no_nsfw: true,
  gender: "All",
  style: "all",
  tags: [],
  sort: "Popular",
  status: 0,
  visible: "Public",
  station: 100,
  disabledInfinite: false,
  showLoadMore: false,
});
const loadMoreDataList = () => {
  if (pageData.isLoadingMoreData) return;
  pageData.isLoadingMoreData = true;
  let page = pageData.page + 1;
  let params = {
    ...pageData,
    page,
  };
  getCharacterList(params)
    .then((res) => {
      if (res.code !== 200 || res.data === null || res.data.length === 0) {
        pageData.disabledInfinite = true;
        pageData.isLoadingMoreData = false;
        return;
      }
      if (page == 1) {
        dataList.value = res.data || [];
      } else {
        dataList.value = [...dataList.value, ...res.data];
      }
      pageData.page = page;
      pageData.isLoadingMoreData = false;

      if (pageData.page < 3) {
        loadMoreDataList();
      }
      if (pageData.page === 3) {
        pageData.showLoadMore = true;
      }
    })
    .catch(() => {
      pageData.isLoadingMoreData = false;
    });
};

const handleLoadMore = () => {
  pageData.showLoadMore = false;
  pageData.disabledInfinite = false;
  loadMoreDataList();
};
const initData = () => {
  pageData.page = 0;
  pageData.showLoadMore = false;
  pageData.disabledInfinite = true;
  loadMoreDataList();
};
onMounted(() => {
  initData();
});
</script>

<style scoped lang="scss">
.character-area {
  background: #f5f7fa;
  min-height: calc(100vh - var(--bottom-bar-height, 60px));
  padding-top: var(--top-bar-height, 60px);
}
.character-content {
  width: 100%;
  display: grid;
  gap: 24px 16px;
  padding: 10px;
  // 暂时控制6个吧
  grid-template-columns: repeat(6, minmax(0px, 1fr));

  @media (max-width: 1280px) {
    grid-template-columns: repeat(4, minmax(0px, 1fr));
  }

  @media (max-width: 768px) {
    grid-template-columns: repeat(3, minmax(0px, 1fr));
  }
  @media (max-width: 592px) {
    gap: 0.75rem;
    grid-template-columns: repeat(2, minmax(0px, 1fr));
  }
}
.character-item {
  position: relative;
  width: 100%;
  border-radius: 8px;
  overflow: hidden;
  padding-top: 133.333%;
  color: #12131a;
  .item-content {
    position: absolute;
    inset: 0;
    .item-img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }
  .item-info {
    padding: 50px 10px 10px;
    width: 100%;
    position: absolute;
    bottom: 0px;
    color: #ffffff;
    background: linear-gradient(
      rgba(22, 24, 35, 0) 2.92%,
      rgba(22, 24, 35, 0.5) 98.99%
    );
    .item-title {
      font-weight: bold;
      font-size: 16px;
    }
    .item-description {
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      font-size: 12px;
    }
  }
}
</style>
