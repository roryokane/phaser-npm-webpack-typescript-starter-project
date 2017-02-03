/*
    The Screen[...] classes are modified versions of the classes in an article I found.

    Author: Tomáš Rychnovský
    Article: http://sbcgamesdev.blogspot.ca/2015/04/phaser-tutorial-manage-different-screen.html
    Date: Thursday, April 9, 2015

    Big thanks to Tomáš!
 */

export enum ScreenOrientation {
    PORTRAIT,
    LANDSCAPE
}

export class ScreenMetrics {
    windowWidth: number;
    windowHeight: number;

    defaultGameWidth: number;
    defaultGameHeight: number;

    maxGameWidth: number;
    maxGameHeight: number;

    gameWidth: number;
    gameHeight: number;

    scaleX: number;
    scaleY: number;

    offsetX: number;
    offsetY: number;
}

export class ScreenUtils {
    public static screenMetrics: ScreenMetrics;

    public static calculateScreenMetrics(defaultWidth: number, defaultHeight: number, orientation: ScreenOrientation = ScreenOrientation.LANDSCAPE, maxGameWidth?: number, maxGameHeight?: number): ScreenMetrics {
        // Just to give some explanation as to the numbers and colors in the included background;
        // The GREEN is the safe area and will be displayed fully on any device and is based on 16:10 aspect ratio, build your actual gameplay here
        // The YELLOW is the extra area that will be visible on devices with a 3:2 aspect ratio (iPhone 4S and below)
        // The RED is the extra area that will be visible on devices with a 4:3 aspect ratio (iPads)
        // The BLUE is the extra area that will be visible on devices with a 16:9 aspect ratio (iPhone 5 and above) (this is probably the most common ratio overall...)
        // The GREY area will most likely never be seen, unless some device has a really odd aspect ratio (and with Android, I wouldn't be surprised if there is a few out there)

        this.screenMetrics = new ScreenMetrics();

        this.screenMetrics.windowWidth = window.innerWidth;
        this.screenMetrics.windowHeight = window.innerHeight;

        this.screenMetrics.defaultGameWidth = defaultWidth;
        this.screenMetrics.defaultGameHeight = defaultHeight;

        // Swap width and height if necessary to match the specified orientation
        let dimensionsOppositeForLandscape: boolean = ((this.screenMetrics.windowWidth < this.screenMetrics.windowHeight) && orientation === ScreenOrientation.LANDSCAPE);
        let dimensionsOppositeForPortrait: boolean = ((this.screenMetrics.windowHeight < this.screenMetrics.windowWidth) && orientation === ScreenOrientation.PORTRAIT);

        if (dimensionsOppositeForLandscape || dimensionsOppositeForPortrait) {
            [this.screenMetrics.windowWidth, this.screenMetrics.windowHeight] = [this.screenMetrics.windowHeight, this.screenMetrics.windowWidth];
        }

        // Calculate the max width and max height if not provided; ratios are based off iPad (4:3) and iPhone 5+ (16:9) as the extremes in both width and height
        if (!maxGameWidth || !maxGameHeight) {
            if (orientation === ScreenOrientation.LANDSCAPE) {
                this.screenMetrics.maxGameWidth = Math.round(this.screenMetrics.defaultGameWidth * (888 / 800));
                this.screenMetrics.maxGameHeight = Math.round(this.screenMetrics.defaultGameHeight * (600 / 500));
            } else {
                this.screenMetrics.maxGameWidth = Math.round(this.screenMetrics.defaultGameWidth * (600 / 500));
                this.screenMetrics.maxGameHeight = Math.round(this.screenMetrics.defaultGameHeight * (888 / 800));
            }
        } else {
            this.screenMetrics.maxGameWidth = maxGameWidth;
            this.screenMetrics.maxGameHeight = maxGameHeight;
        }

        // Calculate game width and height based off the default aspect ratio of 16:10 (800x500)
        let defaultAspectRatio: number = ((orientation === ScreenOrientation.LANDSCAPE) ? (800 / 500) : (500 / 800));
        let windowAspectRatio: number = (this.screenMetrics.windowWidth / this.screenMetrics.windowHeight);

        if (windowAspectRatio > defaultAspectRatio) {
            this.screenMetrics.gameHeight = this.screenMetrics.defaultGameHeight;
            this.screenMetrics.gameWidth = (Math.ceil((this.screenMetrics.gameHeight * windowAspectRatio) * 0.5) * 2);
            this.screenMetrics.gameWidth = Math.min(this.screenMetrics.gameWidth, this.screenMetrics.maxGameWidth);

            this.screenMetrics.offsetX = ((this.screenMetrics.gameWidth - this.screenMetrics.defaultGameWidth) * 0.5);
            this.screenMetrics.offsetY = 0;
        } else {
            this.screenMetrics.gameWidth = this.screenMetrics.defaultGameWidth;
            this.screenMetrics.gameHeight = (Math.ceil((this.screenMetrics.gameWidth / windowAspectRatio) * 0.5) * 2);
            this.screenMetrics.gameHeight = Math.min(this.screenMetrics.gameHeight, this.screenMetrics.maxGameHeight);

            this.screenMetrics.offsetX = 0;
            this.screenMetrics.offsetY = ((this.screenMetrics.gameHeight - this.screenMetrics.defaultGameHeight) * 0.5);
        }

        // Calculate scaling
        this.screenMetrics.scaleX = (this.screenMetrics.windowWidth / this.screenMetrics.gameWidth);
        this.screenMetrics.scaleY = (this.screenMetrics.windowHeight / this.screenMetrics.gameHeight);

        return this.screenMetrics;
    }
}