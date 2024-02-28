


const getAvgTotalEndGamePoints = () => {
      let points = 0;
      points += false ? 1 : (true ? 3 : 0);
      points += true ? 2 : 0;
      points += 5;
      points += true ? 1 : 0;
      return points;
  };

console.log(getAvgTotalEndGamePoints()); // 6