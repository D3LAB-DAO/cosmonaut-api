test('two plus two is four', () => {
    expect(2 + 2).toBe(4);
});

test('object assignment',
    () => {
        interface MyObject {
            [key: string]: string | number;
        }
        const data: MyObject = {one: 1};
        data["two"] = 2;
        expect(data).toEqual({one: 1, two: 2});
    });