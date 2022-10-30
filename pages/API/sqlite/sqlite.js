const openComDB = (name, path, callback) => {  
    plus.sqlite.openDatabase({  
        name: name,  
        path: path,  
        success: function(e) {  
            // plus.nativeUI.alert('打开数据库成功');  
            callback(e)  
        },  
        fail: function(e) {  
            // plus.nativeUI.alert("打开数据库失败");  
            callback(e);  
        }  
    })  
}  

const executeSQL = (name, sql, callback) => {  
    plus.sqlite.selectSql({  
        name: name,  
        sql: sql,  
        success: function(e) {  
            // console.log("查询数据库:" + name + ",表:" + sql + ";的");  
            // console.log(JSON.stringify(e));  
            callback(e);  
        },  
        fail: function(e) {  
            console.log("查询数据库失败:" + JSON.stringify(e));  
            callback(e);  
        }  
    })  
}  

export{  
openComDB,  
executeSQL  
}