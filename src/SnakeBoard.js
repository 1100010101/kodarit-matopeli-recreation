import React, {useState} from 'react'

const SnakeBoard = () => {
const height = 10
const width = 10
var initialRows = []
for (var i = 0; i < height; i++) {
  initialRows[i] = []
    for (var j = 0; j < width; j++) {
      initialRows[i][j] = 'blank'
    }

}
 const [rows, setRows] = useState(initialRows)

 const displayRows = rows.map(row =>
  <div className='Snake-row'>
    {row.map(tile => <div className={tile} />)}
  </div>
  )

  return (
    <div className='Snake-board'>
    {displayRows}
    </div>
  )
}

export default SnakeBoard
