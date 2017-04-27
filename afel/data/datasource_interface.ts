export interface AfelDataSourceInterace {
    fetchDataFromServer(cb)
    getLoadedData()
    setData(data)
}