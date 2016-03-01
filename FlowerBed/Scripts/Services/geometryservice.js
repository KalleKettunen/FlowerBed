function geometryService() {

    /**
     * return squared distance of two points
     * @param {x: number, y: number} p1 
     * @param {x : number, y :number} p2 
     * @returns {number} 
     */
    function sqrDistance(p1, p2) {
        return (p1.x - p2.x) * (p1.x - p2.x) + (p1.y - p2.y) * (p1.y - p2.y);
    };

    /**
     * Detects if point is in a circle
     * @param {x :number, y :number} point 
     * @param {x :number, y :number} center 
     * @param {number} radius 
     * @returns {} 
     */
    function inCircle(point, center, radius) {
        return sqrDistance(point, center) <= radius * radius;
    }

    return {
        sqrDistance: sqrDistance,
        inCircle : inCircle
    }
}