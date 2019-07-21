#pragma strict
@script ExecuteInEditMode()

var tagAndLayerNow = false;
var untagCurrentObjects = true;

function TagAndLayerAll()
{
	var gameObjects : GameObject[] = FindObjectsOfType(GameObject) as GameObject[];

	for(var g : GameObject in gameObjects)
	{
		var needTag = "";
		var needLayer = "";

		var objectsTagged = 0;

		if(g.tag != "Untagged")
		{
			needTag = g.tag;
		}

		if(LayerMask.LayerToName(g.layer) != "Default")
		{
			needLayer = LayerMask.LayerToName(g.layer);
		}

		if(needTag!=""||needLayer!="")
		{
			objectsTagged++;

			var ot : ObjectTagger = g.GetComponent(ObjectTagger);

			if(ot==null)
			ot = g.AddComponent(ObjectTagger);
			
			ot.objectTag = needTag;
			ot.objectLayer = needLayer;

			if(untagCurrentObjects)
			{
			g.tag = "Untagged";
			g.layer = 0;
			}
		}
	}

	Debug.Log("ObjectTagger set on "+objectsTagged+" scene objects");
}
function Update () {

	if(tagAndLayerNow)
	{
		tagAndLayerNow = false;
		TagAndLayerAll();
	}

}