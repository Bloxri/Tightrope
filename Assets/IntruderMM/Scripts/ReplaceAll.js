#pragma strict

@script ExecuteInEditMode()
var go = false;

var toReplace : GameObject[];
var pref : GameObject;

function Update()
{
	if(go)
	{
		for(var i = 0;i<toReplace.length;i++)
		{

			var p = Instantiate(pref);

			p.transform.parent = toReplace[i].transform.parent;
			p.transform.position = toReplace[i].transform.position;
			p.transform.rotation = toReplace[i].transform.rotation;
			p.transform.localScale = toReplace[i].transform.localScale;
		}

		go = false;
	}
}