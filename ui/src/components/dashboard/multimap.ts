export class Multimap<K, V> extends Map<K, V[]> {
    add(k: K, v: V) {
        var array = this.get(k);
        if (!array) {
            array = [];
            this.set(k, array);
        }

        array.push(v);
    }
}