/* eslint-disable no-mixed-operators */
/**
 * Simple RESTful helper class
 */
class Helper {
// helper function to rank student result;
  rankResult(scoreAverage, resultAverages, option) {
    this.resultAveragesArray = []
    // convert resultAverages object to array
    // if (resultAverages) {
    //   for (const key in resultAverages) {
    //     console.log(key)
    //   // this.resultAveragesArray.push(resultAverages[key])
    //   }
    // }
    // eslint-disable-next-line array-callback-return
    // console.log(resultAverages)
    // eslint-disable-next-line array-callback-return
    Object.entries(resultAverages).map(item => {
      // console.log(item)
      this.resultAveragesArray.push(item[1])
      // return item
    })
    // resultAverages.forEach(element => {
    //   resultAveragesArray.push(element)
    // })
    this.resultAveragesArray.sort((a, b) => b - a) // sort numerical array in descending order

    let position = `${this.resultAveragesArray.indexOf(scoreAverage) + 1}`// to get the index/position of this score in the sorted array
    if (option === 'position') {
      const strLength = position.length
      // console.log(position)
      if (position === '1' || (strLength === '2' && position.substr(0, 1) !== '1') && position.substr(1) === '1') {
        position += 'st'
      } else if (position === '2' || (strLength === '2' && position.substr(0, 1) !== '1') && position.substr(1) === '2') {
        position += 'nd'
      } else if (position === '3' || (strLength === '2' && position.substr(0, 1) !== '1') && position.substr(1) === '3') {
        position += 'rd'
      } else {
        position += 'th'
      }
    }
    return position
  }
}
export { Helper as default }
