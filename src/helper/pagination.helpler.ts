const paginationHelper = (page : number, limit : number, totalProduct : number) => {
    const totalPage : number = Math.ceil(totalProduct / limit);
    const skip : number = (page - 1) * limit;
    return {
        skip : skip,
        totalPage : totalPage,
        currentPage : page,
        limit : limit,
    }
}




export default paginationHelper;