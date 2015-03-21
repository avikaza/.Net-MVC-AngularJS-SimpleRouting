
/*angular
    .module('myApp.ctrl.home', [])
    .controller('homeCtrl', ['$scope', function ($scope) {
*/
function HomeCtrl($scope) {
    $scope.thingsOptions = {
        dataSource: {
            data: [{ name: "Grid", id: 1 },
                   { name: "Bar Chart", id: 2 },
                   { name: "Radial Gauge", id: 3 },
                   { name: "Pie Chart", id: 4 }]
        },
        dataTextField: "name",
        dataValueField: "id",
        optionLabel: "Select A Component"
    };
    $scope.testInclude = "/SPAView/TestInclude.html";
    $scope.nowShowingTitle = "<=== Select"
    $scope.selectChangeHandler = function (e) {
        $scope.nowShowingTitle = e.sender.text();
    }
    //$scope.products = [{ "ProductID": 1, "ProductName": "Chai", "Supplier": { "SupplierID": 1, "SupplierName": "Exotic Liquids" }, "Category": { "CategoryID": 1, "CategoryName": "Beverages" }, "UnitPrice": 18.0, "UnitsInStock": 39, "Discontinued": false }, { "ProductID": 2, "ProductName": "Chang", "Supplier": { "SupplierID": 1, "SupplierName": "Exotic Liquids" }, "Category": { "CategoryID": 1, "CategoryName": "Beverages" }, "UnitPrice": 19.0, "UnitsInStock": 17, "Discontinued": false }, { "ProductID": 3, "ProductName": "Aniseed Syrup", "Supplier": { "SupplierID": 1, "SupplierName": "Exotic Liquids" }, "Category": { "CategoryID": 2, "CategoryName": "Condiments" }, "UnitPrice": 10.0, "UnitsInStock": 13, "Discontinued": false }, { "ProductID": 4, "ProductName": "Chef Anton\u0027s Cajun Seasoning", "Supplier": { "SupplierID": 2, "SupplierName": "New Orleans Cajun Delights" }, "Category": { "CategoryID": 2, "CategoryName": "Condiments" }, "UnitPrice": 22.0, "UnitsInStock": 53, "Discontinued": false }, { "ProductID": 5, "ProductName": "Chef Anton\u0027s Gumbo Mix", "Supplier": { "SupplierID": 2, "SupplierName": "New Orleans Cajun Delights" }, "Category": { "CategoryID": 2, "CategoryName": "Condiments" }, "UnitPrice": 21.35, "UnitsInStock": 0, "Discontinued": true }, { "ProductID": 6, "ProductName": "Grandma\u0027s Boysenberry Spread", "Supplier": { "SupplierID": 3, "SupplierName": "Grandma Kelly\u0027s Homestead" }, "Category": { "CategoryID": 2, "CategoryName": "Condiments" }, "UnitPrice": 25.0, "UnitsInStock": 120, "Discontinued": false }, { "ProductID": 7, "ProductName": "Uncle Bob\u0027s Organic Dried Pears", "Supplier": { "SupplierID": 3, "SupplierName": "Grandma Kelly\u0027s Homestead" }, "Category": { "CategoryID": 7, "CategoryName": "Produce" }, "UnitPrice": 30.0, "UnitsInStock": 15, "Discontinued": false }, { "ProductID": 8, "ProductName": "Northwoods Cranberry Sauce", "Supplier": { "SupplierID": 3, "SupplierName": "Grandma Kelly\u0027s Homestead" }, "Category": { "CategoryID": 2, "CategoryName": "Condiments" }, "UnitPrice": 40.0, "UnitsInStock": 6, "Discontinued": false }, { "ProductID": 9, "ProductName": "Mishi Kobe Niku", "Supplier": { "SupplierID": 4, "SupplierName": "Tokyo Traders" }, "Category": { "CategoryID": 6, "CategoryName": "Meat/Poultry" }, "UnitPrice": 97.0, "UnitsInStock": 29, "Discontinued": true }, { "ProductID": 10, "ProductName": "Ikura", "Supplier": { "SupplierID": 4, "SupplierName": "Tokyo Traders" }, "Category": { "CategoryID": 8, "CategoryName": "Seafood" }, "UnitPrice": 31.0, "UnitsInStock": 31, "Discontinued": false }, { "ProductID": 11, "ProductName": "Queso Cabrales", "Supplier": { "SupplierID": 5, "SupplierName": "Cooperativa de Quesos \u0027Las Cabras\u0027" }, "Category": { "CategoryID": 4, "CategoryName": "Dairy Products" }, "UnitPrice": 21.0, "UnitsInStock": 22, "Discontinued": false }, { "ProductID": 12, "ProductName": "Queso Manchego La Pastora", "Supplier": { "SupplierID": 5, "SupplierName": "Cooperativa de Quesos \u0027Las Cabras\u0027" }, "Category": { "CategoryID": 4, "CategoryName": "Dairy Products" }, "UnitPrice": 38.0, "UnitsInStock": 86, "Discontinued": false }, { "ProductID": 13, "ProductName": "Konbu", "Supplier": { "SupplierID": 6, "SupplierName": "Mayumi\u0027s" }, "Category": { "CategoryID": 8, "CategoryName": "Seafood" }, "UnitPrice": 6.0, "UnitsInStock": 24, "Discontinued": false }, { "ProductID": 14, "ProductName": "Tofu", "Supplier": { "SupplierID": 6, "SupplierName": "Mayumi\u0027s" }, "Category": { "CategoryID": 7, "CategoryName": "Produce" }, "UnitPrice": 23.25, "UnitsInStock": 35, "Discontinued": false }, { "ProductID": 15, "ProductName": "Genen Shouyu", "Supplier": { "SupplierID": 6, "SupplierName": "Mayumi\u0027s" }, "Category": { "CategoryID": 2, "CategoryName": "Condiments" }, "UnitPrice": 15.5, "UnitsInStock": 39, "Discontinued": false }, { "ProductID": 16, "ProductName": "Pavlova", "Supplier": { "SupplierID": 7, "SupplierName": "Pavlova, Ltd." }, "Category": { "CategoryID": 3, "CategoryName": "Confections" }, "UnitPrice": 17.45, "UnitsInStock": 29, "Discontinued": false }, { "ProductID": 17, "ProductName": "Alice Mutton", "Supplier": { "SupplierID": 7, "SupplierName": "Pavlova, Ltd." }, "Category": { "CategoryID": 6, "CategoryName": "Meat/Poultry" }, "UnitPrice": 39.0, "UnitsInStock": 0, "Discontinued": true }, { "ProductID": 18, "ProductName": "Carnarvon Tigers", "Supplier": { "SupplierID": 7, "SupplierName": "Pavlova, Ltd." }, "Category": { "CategoryID": 8, "CategoryName": "Seafood" }, "UnitPrice": 62.5, "UnitsInStock": 42, "Discontinued": false }, { "ProductID": 19, "ProductName": "Teatime Chocolate Biscuits", "Supplier": { "SupplierID": 8, "SupplierName": "Specialty Biscuits, Ltd." }, "Category": { "CategoryID": 3, "CategoryName": "Confections" }, "UnitPrice": 9.2, "UnitsInStock": 25, "Discontinued": false }, { "ProductID": 20, "ProductName": "Sir Rodney\u0027s Marmalade", "Supplier": { "SupplierID": 8, "SupplierName": "Specialty Biscuits, Ltd." }, "Category": { "CategoryID": 3, "CategoryName": "Confections" }, "UnitPrice": 81.0, "UnitsInStock": 40, "Discontinued": false }];
    $scope.products = new kendo.data.DataSource({
            data: [{ "ProductID": 1, "ProductName": "Chai", "Supplier": { "SupplierID": 1, "SupplierName": "Exotic Liquids" }, "Category": { "CategoryID": 1, "CategoryName": "Beverages" }, "UnitPrice": 18.0, "UnitsInStock": 39, "Discontinued": false }, { "ProductID": 2, "ProductName": "Chang", "Supplier": { "SupplierID": 1, "SupplierName": "Exotic Liquids" }, "Category": { "CategoryID": 1, "CategoryName": "Beverages" }, "UnitPrice": 19.0, "UnitsInStock": 17, "Discontinued": false }, { "ProductID": 3, "ProductName": "Aniseed Syrup", "Supplier": { "SupplierID": 1, "SupplierName": "Exotic Liquids" }, "Category": { "CategoryID": 2, "CategoryName": "Condiments" }, "UnitPrice": 10.0, "UnitsInStock": 13, "Discontinued": false }, { "ProductID": 4, "ProductName": "Chef Anton\u0027s Cajun Seasoning", "Supplier": { "SupplierID": 2, "SupplierName": "New Orleans Cajun Delights" }, "Category": { "CategoryID": 2, "CategoryName": "Condiments" }, "UnitPrice": 22.0, "UnitsInStock": 53, "Discontinued": false }, { "ProductID": 5, "ProductName": "Chef Anton\u0027s Gumbo Mix", "Supplier": { "SupplierID": 2, "SupplierName": "New Orleans Cajun Delights" }, "Category": { "CategoryID": 2, "CategoryName": "Condiments" }, "UnitPrice": 21.35, "UnitsInStock": 0, "Discontinued": true }, { "ProductID": 6, "ProductName": "Grandma\u0027s Boysenberry Spread", "Supplier": { "SupplierID": 3, "SupplierName": "Grandma Kelly\u0027s Homestead" }, "Category": { "CategoryID": 2, "CategoryName": "Condiments" }, "UnitPrice": 25.0, "UnitsInStock": 120, "Discontinued": false }, { "ProductID": 7, "ProductName": "Uncle Bob\u0027s Organic Dried Pears", "Supplier": { "SupplierID": 3, "SupplierName": "Grandma Kelly\u0027s Homestead" }, "Category": { "CategoryID": 7, "CategoryName": "Produce" }, "UnitPrice": 30.0, "UnitsInStock": 15, "Discontinued": false }, { "ProductID": 8, "ProductName": "Northwoods Cranberry Sauce", "Supplier": { "SupplierID": 3, "SupplierName": "Grandma Kelly\u0027s Homestead" }, "Category": { "CategoryID": 2, "CategoryName": "Condiments" }, "UnitPrice": 40.0, "UnitsInStock": 6, "Discontinued": false }, { "ProductID": 9, "ProductName": "Mishi Kobe Niku", "Supplier": { "SupplierID": 4, "SupplierName": "Tokyo Traders" }, "Category": { "CategoryID": 6, "CategoryName": "Meat/Poultry" }, "UnitPrice": 97.0, "UnitsInStock": 29, "Discontinued": true }, { "ProductID": 10, "ProductName": "Ikura", "Supplier": { "SupplierID": 4, "SupplierName": "Tokyo Traders" }, "Category": { "CategoryID": 8, "CategoryName": "Seafood" }, "UnitPrice": 31.0, "UnitsInStock": 31, "Discontinued": false }, { "ProductID": 11, "ProductName": "Queso Cabrales", "Supplier": { "SupplierID": 5, "SupplierName": "Cooperativa de Quesos \u0027Las Cabras\u0027" }, "Category": { "CategoryID": 4, "CategoryName": "Dairy Products" }, "UnitPrice": 21.0, "UnitsInStock": 22, "Discontinued": false }, { "ProductID": 12, "ProductName": "Queso Manchego La Pastora", "Supplier": { "SupplierID": 5, "SupplierName": "Cooperativa de Quesos \u0027Las Cabras\u0027" }, "Category": { "CategoryID": 4, "CategoryName": "Dairy Products" }, "UnitPrice": 38.0, "UnitsInStock": 86, "Discontinued": false }, { "ProductID": 13, "ProductName": "Konbu", "Supplier": { "SupplierID": 6, "SupplierName": "Mayumi\u0027s" }, "Category": { "CategoryID": 8, "CategoryName": "Seafood" }, "UnitPrice": 6.0, "UnitsInStock": 24, "Discontinued": false }, { "ProductID": 14, "ProductName": "Tofu", "Supplier": { "SupplierID": 6, "SupplierName": "Mayumi\u0027s" }, "Category": { "CategoryID": 7, "CategoryName": "Produce" }, "UnitPrice": 23.25, "UnitsInStock": 35, "Discontinued": false }, { "ProductID": 15, "ProductName": "Genen Shouyu", "Supplier": { "SupplierID": 6, "SupplierName": "Mayumi\u0027s" }, "Category": { "CategoryID": 2, "CategoryName": "Condiments" }, "UnitPrice": 15.5, "UnitsInStock": 39, "Discontinued": false }, { "ProductID": 16, "ProductName": "Pavlova", "Supplier": { "SupplierID": 7, "SupplierName": "Pavlova, Ltd." }, "Category": { "CategoryID": 3, "CategoryName": "Confections" }, "UnitPrice": 17.45, "UnitsInStock": 29, "Discontinued": false }, { "ProductID": 17, "ProductName": "Alice Mutton", "Supplier": { "SupplierID": 7, "SupplierName": "Pavlova, Ltd." }, "Category": { "CategoryID": 6, "CategoryName": "Meat/Poultry" }, "UnitPrice": 39.0, "UnitsInStock": 0, "Discontinued": true }, { "ProductID": 18, "ProductName": "Carnarvon Tigers", "Supplier": { "SupplierID": 7, "SupplierName": "Pavlova, Ltd." }, "Category": { "CategoryID": 8, "CategoryName": "Seafood" }, "UnitPrice": 62.5, "UnitsInStock": 42, "Discontinued": false }, { "ProductID": 19, "ProductName": "Teatime Chocolate Biscuits", "Supplier": { "SupplierID": 8, "SupplierName": "Specialty Biscuits, Ltd." }, "Category": { "CategoryID": 3, "CategoryName": "Confections" }, "UnitPrice": 9.2, "UnitsInStock": 25, "Discontinued": false }, { "ProductID": 20, "ProductName": "Sir Rodney\u0027s Marmalade", "Supplier": { "SupplierID": 8, "SupplierName": "Specialty Biscuits, Ltd." }, "Category": { "CategoryID": 3, "CategoryName": "Confections" }, "UnitPrice": 81.0, "UnitsInStock": 40, "Discontinued": false }],
            pageSize: 5
    });

    //============== Chart ====================//
    $scope.chartSettings = {
        type: 'line'
    };

    $scope.column = {
        title: {
            text: "Site Visitors Stats /thousands/"
        },
        legend: {
            visible: false
        },
        seriesDefaults: {
            type: "column"
        },
        series: [{
            name: "Total Visits",
            data: [56000, 63000, 74000]
        },
          {
              name: "Unique visitors",
              data: [52000, 34000, 23000]
          }],
        valueAxis: {
            max: 100000,
            line: {
                visible: false
            },
            minorGridLines: {
                visible: true
            }
        },
        categoryAxis: {
            categories: ["Jan", "Feb", "Mar"],
            majorGridLines: {
                visible: false
            }
        },
        tooltip: {
            visible: true,
            template: "#= series.name #: #= value #"
        },
        chartArea: {
            background: ""
        }
    };


    $scope.pie = ({
        title: {
            position: "bottom",
            text: "Share of Internet Population Growth"
        },
        legend: {
            visible: false
        },
        chartArea: {
            background: ""
        },
        seriesDefaults: {
            labels: {
                visible: true,
                background: "transparent",
                template: "#= category #: #= value#%"
            }
        },
        series: [{
            type: "pie",
            startAngle: 150,
            data: [{
                category: "Asia",
                value: 53.8,
                color: "#9de219"
            }, {
                category: "Europe",
                value: 16.1,
                color: "#90cc38"
            }, {
                category: "Latin America",
                value: 11.3,
                color: "#068c35"
            }, {
                category: "Africa",
                value: 9.6,
                color: "#006634"
            }, {
                category: "Middle East",
                value: 5.2,
                color: "#004d38"
            }, {
                category: "North America",
                value: 3.6,
                color: "#033939"
            }]
        }],
        tooltip: {
            visible: true,
            format: "{0}%"
        }
    }
    );
}
HomeCtrl.$inject = ['$scope'];
/*]);*/