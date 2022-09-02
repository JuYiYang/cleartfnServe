const randomCode = () => {
  let num = Math.floor(Math.random() * (0 - 9999) + 9999)
  let numA = Array(4).join(0) + num
  return numA.slice(-4)
}

module.exports = randomCode