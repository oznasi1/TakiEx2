
var faceDownAttribute = "card_back";

class Card{
    //attributes[1] is the valid attribute
constructor(i_Color, i_Id, card_atrributes, actionCard)
{
    this.color = i_Color;
    this.id = i_Id;
    this.cardAtrribute = card_atrributes;
    this.isUp = false;
    this.isActionCard = actionCard;
    this.attributes = ["card", faceDownAttribute];

}
  
    makeCardFaceUp () {
        this.attributes[1] = this.cardAtrribute;
        this.isUp = true;
    }

    makeCardFaceDown() {
        this.attributes[1] = faceDownAttribute;
        this.isUp = false;
    }

    getAttributes  () {
        var attributesStr = this.attributes[0] + " " + this.attributes[1];
        return attributesStr;
    }

    setAttributes  (newAttribute) {
        this.attributes[1] = newAttribute;
    }

    getColor (){
        return this.color;
    }

    setColor (i_Color) {
        this.color = i_Color;
    }

    getId (){
        return this.id;
    }

   isUp (){
        return this.isUp;
    }

    isActionCard (){
        return this.isActionCard;
    }
}

export {Card};