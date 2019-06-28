# SvgMap
In the Svg Map excersize a test-taker must chose the appropriate route trough a map.

The map is specified by an SVG file with lines. Lines must NOT be connected on junctions.

# Functional scoring
A scoring function can be defined as such:
```javascript
    function(pathNodes, pois){
      return score;
    }
```
Where `pathNodes` is an array of node ids and `pois` is a list of visited point of interrests.
`score` can be anything, number, string or even an object containing sub scores.
