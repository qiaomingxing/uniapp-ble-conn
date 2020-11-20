const pager = {
	pageNo: 1, // 当前页数
	pageSize: 20, // 每页数量
	pages: 0, // 总页数
	total: 0, // 总数量
	data: [], // 数据
	isBlank: false, // 是否为空
	isLoadMore: false, // 是否显示加载更多
	loadMoreText: '加载中', // 加载更多文字
	status: 'loading' // 加载状态:more,loading,noMore
}

module.exports = {
	pager: pager
}
