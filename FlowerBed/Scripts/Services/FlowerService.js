function flowerService(repository, data) {
    var _repo = repository,
        service = {
            selectedFlower: function() {
                return _repo.findFlower($(data.selectedFlower).val());
            }
        };

    return service;
}