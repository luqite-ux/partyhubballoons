export type RqwSportsProduct = {
  slug: string;
  sourceFile: string;
  name: string;
  image: string;
};

const productSources = [
  ["artificial-fishing-lure", "人造鱼饵.png", "Artificial Fishing Lure"],
  ["sports-ball", "体育用球.png", "Sports Ball"],
  ["sports-net", "体育用网.png", "Sports Net"],
  ["fitness-training-equipment", "体能锻炼设备.png", "Fitness Training Equipment"],
  ["fitness-machine", "健身器械.png", "Fitness Machine"],
  ["fencing-weapon", "击剑武器.png", "Fencing Equipment"],
  ["rowing-machine", "划船机器械.png", "Rowing Machine"],
  ["dumbbells", "哑铃.png", "Dumbbells"],
  ["stationary-bike-roller", "固定式健身自行车用滚轮.png", "Stationary Exercise Bike"],
  ["infant-toys", "婴儿玩具.png", "Infant Toys"],
  ["goalkeeper-gloves", "守门员手套.png", "Goalkeeper Gloves"],
  ["pet-toys", "宠物玩具.png", "Pet Toys"],
  ["resistance-band", "弹力带.png", "Resistance Band"],
  ["hand-grip-trainer", "握力训练器.png", "Hand Grip Trainer"],
  ["smart-robot-toy", "智能机器人玩具.png", "Smart Robot Toy"],
  ["smart-plush-toys", "智能毛绒玩具.png", "Smart Plush Toys"],
  ["barbell", "杠铃.jpg", "Barbell"],
  ["plush-toy", "毛绒玩具.jpg", "Plush Toy"],
  ["water-skis", "水撬.jpg", "Water Skis"],
  ["punching-bag", "沙袋.png", "Punching Bag"],
  ["game-controller", "游戏中的玩家操作控制.png", "Game Controller"],
  ["game-ball", "游戏用球.png", "Game Ball"],
  ["swim-rings", "游泳圈.png", "Swim Rings"],
  ["swim-fins", "游泳脚蹼.png", "Swim Fins"],
  ["swimming-flippers", "游泳蹼.png", "Swimming Flippers"],
  ["skateboard", "滑板.png", "Skateboard"],
  ["paraglider", "滑翔伞.png", "Paraglider"],
  ["roller-skates", "滑轮鞋.png", "Roller Skates"],
  ["ski-bag", "滑雪包装袋.png", "Ski Bag"],
  ["toy-drone", "玩具无人机.png", "Toy Drone"],
  ["toy-robot", "玩具机器人.png", "Toy Robot"],
  ["toy-balloon", "玩具气球.png", "Toy Balloon"],
  ["toy-cars", "玩具汽车.png", "Toy Cars"],
  ["toy-scooters", "玩具滑板车.png", "Toy Scooters"],
  ["building-blocks", "玩具积木.png", "Building Blocks"],
  ["toy-vehicle", "玩具车辆.png", "Toy Vehicle"],
  ["racket", "球拍.png", "Racket"],
  ["yoga-swing", "瑜伽秋千.png", "Yoga Swing"],
  ["video-game-console", "电子游戏装置.png", "Video Game Console"],
  ["climbing-harness", "登山者安全带.png", "Climbing Harness"],
  ["shuttlecock", "羽毛球.png", "Shuttlecock"],
  ["chest-exerciser", "胸部锻炼器、拉伸器.png", "Chest Exerciser"],
  ["waist-trainer", "腰部塑形健身带.png", "Waist Trainer"],
  ["training-bar", "训练杆.png", "Training Bar"],
  ["springboard", "跳板.png", "Springboard"],
  ["wrist-support", "运动用护腕.png", "Wrist Support"],
  ["waist-support", "运动用护腰.png", "Waist Support"],
  ["knee-support", "运动用护膝.png", "Knee Support"],
  ["fishing-tackle", "钓鱼用具.png", "Fishing Tackle"],
  ["fishing-rod", "钓鱼竿.png", "Fishing Rod"],
  ["flying-discs", "飞盘.png", "Flying Discs"],
  ["dice", "骰子.jpg", "Dice"],
  ["golf-club", "高尔夫球杆.png", "Golf Club"],
] as const;

export const rqwSportsProducts: RqwSportsProduct[] = productSources.map(
  ([slug, sourceFile, name]) => ({
    slug,
    sourceFile,
    name,
    image: `/rqw-sports/products/${slug}.png`,
  }),
);

export const RQW_SPORTS_PRODUCT_COUNT = 53;
