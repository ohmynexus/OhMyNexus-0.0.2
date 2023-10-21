const { Function: Func } = new(require('@neoxr/wb'))
 
Func.fibonacci = (x, y, number, opr) => {
   let value = [x, y]
   for (let i = 1; i <= number; i++) {
      const x1 = value[value.length - 2]
      const x2 = value[value.length - 1]
      value.push(eval(x1 + opr + x2))
   }
   return value
}