export interface AfelDataSourceInterace {
    fetchInitDataFromServer(cb)
    getLoadedData()
    setData(data)
}