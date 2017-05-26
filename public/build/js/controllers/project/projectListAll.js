angular.module('app.controllers')
    .controller('ProjectListAllController',['$scope','Project',function($scope,Project){

        $scope.projects = [];
        $scope.totalProjects = 0;
        $scope.projectsPerPage = 3;

        $scope.pagination = {
            current: 1
        };

        $scope.pageChanged = function (newPage) {
            getResultsPage(newPage);
        };

        function getResultsPage(pageNumber) {
            Project.query({
                page: pageNumber,
                limit: $scope.projectsPerPage
            }, function (data) {
                $scope.projects = data.data;
                $scope.totalProjects = data.meta.pagination.total;
            });
        }

        getResultsPage(1);
        // $scope.projects = Project.query();

    }]);