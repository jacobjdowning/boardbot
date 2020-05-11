module.exports = {
    shuffle : (array) => {
        for(var i = array.length-1; i>=0; i--){
            let j = parseInt(Math.random() * i);
            let x = array[i];
            array[i] = array[j];
            array[j] = x;
        }
        return array
    }
}