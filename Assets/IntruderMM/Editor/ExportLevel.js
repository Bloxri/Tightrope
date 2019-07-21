// This script is used to export a Unity scene file into an Intruder Level File .ilf
import System.Diagnostics;
import System.Net;
import System;
import System.Collections.Generic;
import System.Linq;
import System.Text;
import System.Security.Cryptography.X509Certificates;
import System.Net.Security;


//INTRUDER MM VERSION 1
 
@MenuItem("Intruder/Export Scene for Intruder _%e")
static function ExportSceneForIntruder() {
	if (PlayerPrefs.HasKey("ExportLevel.lastLevelExportFullPath") &&
		PlayerPrefs.HasKey("ExportLevel.lastLevelSceneFilePath") && 
		PlayerPrefs.GetString("ExportLevel.lastLevelSceneFilePath") == EditorApplication.currentScene)
	{
		PlayerPrefs.DeleteKey("ExportLevel.lastLevelExportFileName");
		DoWorkToExportScene(PlayerPrefs.GetString("ExportLevel.lastLevelExportFullPath"));
		return;
	}
	ExportSceneForIntruderAs();
}

@MenuItem ("Intruder/Export Scene for Intruder as... _%#e")
static function ExportSceneForIntruderAs() {
	var myPath = "";
	var directory = "";
	var filename  = "";
	
	if (PlayerPrefs.HasKey("ExportLevel.lastLevelExportDirectory")) {
		directory = PlayerPrefs.GetString("ExportLevel.lastLevelExportDirectory");
	}
	else if (PlayerPrefs.HasKey("ExportLevel.intruderWorkingDirectory")) {
		directory = PlayerPrefs.GetString("ExportLevel.intruderWorkingDirectory");
	}
	
	if (PlayerPrefs.HasKey("ExportLevel.lastLevelExportFileName") && 
		PlayerPrefs.HasKey("ExportLevel.lastLevelSceneFilePath") &&
		PlayerPrefs.GetString("ExportLevel.lastLevelSceneFilePath") == EditorApplication.currentScene)
	{
		filename = PlayerPrefs.GetString("ExportLevel.lastLevelExportFileName");
	} else {
		var sceneNameSplit : String[] = EditorApplication.currentScene.Split('/'[0]);
		filename = sceneNameSplit[sceneNameSplit.length-1].Replace('.unity','');	
	}
	
	myPath = EditorUtility.SaveFilePanel("Export Intruder Level", directory, filename, "ilf");
	DoWorkToExportScene(myPath);
}

// This is where the actual work is done
static function DoWorkToExportScene(myPath : String) {

	var defaultLevelName = "Assets/Level1.unity";
	var defaultLevelBackupName = "Assets/Level1.unity_backup";

	if (myPath == "") {
		print("Export canceled");
		return;
	}

	//////////////CLEAN LEVEL
	var cls : CustomLevelSettings = GameObject.FindObjectOfType(CustomLevelSettings);
	
	if(cls!=null)
	{
		cls.SetSettings();
	}
	else
	{
		var clsgo = new GameObject();
		clsgo.name = "CustomLevelSettings";
		cls = clsgo.AddComponent(CustomLevelSettings);
		cls.SetSettings();
	}

	var cams : Camera[] = GameObject.FindObjectsOfType(Camera);
	var camCount = 0;
	
	for(var i = 0;i<cams.length; i++)
	{
		if(cams[i].gameObject.GetComponent(ObserveCamProxy)==null&&cams[i].enabled)
		{
			if(cams[i].targetTexture == null)
			{
			cams[i].enabled = false;
			camCount++;
			}
		}
	}
	if(camCount>0)
	{
		print("You had "+camCount+" extra Cameras enabled, they were disabled for export.");
	}

	var listeners : AudioListener[] = GameObject.FindObjectsOfType(AudioListener);
	var listenerCount = 0;

	for(i = 0;i<listeners.length;i++)
	{
		if(listeners[i].enabled)
		{
			listeners[i].enabled = false;
			listenerCount++;
		}
	}
	if(listenerCount>0)
	print("You had "+listenerCount+" extra AudioListeners enabled, they were disabled for export.");


	///////////END OF CLEAN UP

	EditorApplication.SaveScene();

	if (EditorApplication.currentScene != defaultLevelName) {
		if (System.IO.File.Exists(defaultLevelName)) {
				FileUtil.ReplaceFile(defaultLevelName, defaultLevelBackupName);
		}
		FileUtil.ReplaceFile(EditorApplication.currentScene, defaultLevelName);
	}
	
	var levels : String[] = [defaultLevelName];
      
	PlayerPrefs.SetString("ExportLevel.lastLevelSceneFilePath", EditorApplication.currentScene);
	PlayerPrefs.SetString("ExportLevel.lastLevelExportFullPath", myPath);
	var myPathSplit : Array = myPath.Split('/'[0]);
	var levelFileName = myPathSplit[myPathSplit.length-1];
	PlayerPrefs.SetString("ExportLevel.lastLevelExportFileName", myPathSplit[myPathSplit.length-1]);
	myPathSplit[myPathSplit.length-1] = '';
	PlayerPrefs.SetString("ExportLevel.lastLevelExportDirectory", myPathSplit.Join('/'));
	
	print("Exporting " + EditorApplication.currentScene + " to " + myPath);
	var crcResult : uint = 0;
	


	var names = AssetDatabase.GetAllAssetBundleNames();
    
    for (var name in names)
    {
        print("Asset Bundle: " + name);
        AssetDatabase.RemoveAssetBundleName(name, true);
    }
	

	// if (Selection.assetGUIDs.Length > 0) 
	// {
	// for (var asset : Object in Selection.objects) 
	// {
	// var path : String = AssetDatabase.GetAssetPath (asset);
	var assetImporter : AssetImporter  = AssetImporter.GetAtPath ("Assets/Level1.unity");
	assetImporter.assetBundleName = levelFileName;
	//print(Selection.assetGUIDs.Length + " Asset Bundles Assigned");
	// }
	// } else {
	// print("No Assets Selected");
	// }

	//BuildPipeline.BuildStreamedSceneAssetBundle(levels, myPath, BuildTarget.StandaloneWindows, crcResult); 
	
	BuildPipeline.BuildAssetBundles ( myPathSplit.Join('/'), BuildAssetBundleOptions.ForceRebuildAssetBundle);
	// UnityEngine.Debug.Log(crcResult);

	// Remember the crc for this level that you exported - blaze
	PlayerPrefs.SetInt("ExportLevel.crc." + PlayerPrefs.GetString("ExportLevel.lastLevelExportFullPath"), crcResult);

	if (EditorApplication.currentScene != defaultLevelName) {
		if (System.IO.File.Exists(defaultLevelBackupName)) {
			FileUtil.ReplaceFile(defaultLevelBackupName, defaultLevelName);
		}
	}

	var go = GameObject.FindObjectOfType(CustomLevelSettings);

	if(go!=null)
	{
		DestroyImmediate(go.gameObject);
	}

	print("Exporting complete!");
	/***
	print( PlayerPrefs.GetString("ExportLevel.lastLevelSceneFilePath") );
	print( PlayerPrefs.GetString("ExportLevel.lastLevelExportFullPath"));
	print( PlayerPrefs.GetString("ExportLevel.lastLevelExportFileName"));
	print( PlayerPrefs.GetString("ExportLevel.lastLevelExportDirectory"));
	***/

	PlayerPrefs.Save();

	names = AssetDatabase.GetAllAssetBundleNames();
    
    for (var name in names)
    {
        print("Asset Bundle: " + name);
        AssetDatabase.RemoveAssetBundleName(name, true);
    }
}

@MenuItem("Intruder/Select Intruder Application")
static function FindIntruderApplication() {
	var myPath = "";
	
	#if UNITY_EDITOR_OSX
		myPath = EditorUtility.OpenFilePanel("Find Intruder Application", "", "app");
	#endif
	#if UNITY_EDITOR_WIN
		myPath = EditorUtility.OpenFilePanel("Find Intruder Application", "", "exe");	
	#endif
	PlayerPrefs.SetString("ExportLevel.intruderApplicationPath", myPath);

	var intruderApplicationPathSplit : String[] = myPath.Split('/'[0]);
	var intruderApplicationName = intruderApplicationPathSplit[intruderApplicationPathSplit.length-1];
	intruderApplicationPathSplit[intruderApplicationPathSplit.length-1] = '';
	var intruderWorkingDirectory : String = '/';

	for (var i = 0; i < intruderApplicationPathSplit.length-1; i++) {
		intruderWorkingDirectory += intruderApplicationPathSplit[i];
		if (i < intruderApplicationPathSplit.Length-2) {
			intruderWorkingDirectory += '/';
		}
	}

	PlayerPrefs.SetString("ExportLevel.intruderWorkingDirectory",intruderWorkingDirectory);
	PlayerPrefs.SetString("ExportLevel.intruderLevelDirectory",intruderWorkingDirectory + '/content/levels');
	PlayerPrefs.Save();
	
	return myPath;
}

@MenuItem("Intruder/Play Scene in Intruder _%i")
static function PlaySceneInIntruder() 
{

	var intruderApplicationPath = '';
	
	if (PlayerPrefs.HasKey("ExportLevel.intruderApplicationPath")) {
		intruderApplicationPath = PlayerPrefs.GetString("ExportLevel.intruderApplicationPath");
		
		#if UNITY_EDITOR_OSX
		if (!System.IO.Directory.Exists(intruderApplicationPath)) {
		#endif
		#if UNITY_EDITOR_WIN
		if (!System.IO.File.Exists(intruderApplicationPath)) {
		#endif

			// The Intruder application appears to exist
			print(intruderApplicationPath+" file doesn't appear to exist."); 
			PlayerPrefs.DeleteKey("ExportLevel.intruderApplicationPath");
			PlayerPrefs.Save();
			intruderApplicationPath = '';
		}
		else {
			//print(intruderApplicationPath + " appears to exist.");
		}
	}

	if (intruderApplicationPath == '')
	{
		intruderApplicationPath = FindIntruderApplication();
		if (intruderApplicationPath == '') {
			print('Launch of Intruder canceled');
			return;
		}
	}

	print("About to launch " + intruderApplicationPath);

	// Make sure this scene file is exported
	ExportSceneForIntruder();
	var lastLevelNameNoExtension : String = PlayerPrefs.GetString("ExportLevel.lastLevelExportFileName").Replace('.ilf','');
	var lastLevelExportFullPath : String = PlayerPrefs.GetString("ExportLevel.lastLevelExportFullPath");
	
	var myProc : Process = new Process();
	myProc.StartInfo.FileName = intruderApplicationPath;
	#if UNITY_EDITOR_OSX
	//myProc.StartInfo.Arguments = '--args loadlevel ' + lastLevelNameNoExtension + '';

	myProc.StartInfo.Arguments = '--args loadlevel "' + lastLevelExportFullPath + '"';
	#endif
	#if UNITY_EDITOR_WIN
	myProc.StartInfo.Arguments = 'loadlevel "' + lastLevelExportFullPath + '"';
	#endif
	myProc.Start();

	print("Argments: "+myProc.StartInfo.Arguments);
}

static var uploadPath : String;
static var uploading = false;
static var defaultUploadUrl : String = "https://superbossgames.com/intruder/dlc5/upload/";
static var uploadUrl : String = "https://superbossgames.com/intruder/dlc5/upload/";


@MenuItem ("Intruder/Login and Upload")
static function LoadLoginWindow () {
	// Get existing open window or if none, make a new one:	

	
	
	var window = ScriptableObject.CreateInstance.<LoginWindow>();

	window.Show();

	// if (PlayerPrefs.HasKey("ExportLevel.username")) 
	// {
	// 	LoginWindow.username = PlayerPrefs.GetString("ExportLevel.username");
	// }

	// if (PlayerPrefs.HasKey("ExportLevel.password")) 
	// {
	// 	LoginWindow.password = PlayerPrefs.GetString("ExportLevel.password");
	// }
}

@MenuItem( "Intruder/Upload Level _%u" )
static function Upload()
{

	if(EditorApplication.isCompiling)
	{
		print("Please wait until compiling finishes before uploading. Should be done in a few seconds.");
		return;
	}
		if(LoginWindow.username==""||LoginWindow.password=="")
		{
			print("Please set login credentials before uploading");
			LoadLoginWindow();
		}
		else
		{
			if(!uploading)
			{
	        var dir : String;

	       	if (PlayerPrefs.HasKey("ExportLevel.lastLevelExportDirectory")) {
				dir = PlayerPrefs.GetString("ExportLevel.lastLevelExportDirectory");
			}

	        var pathd : String = EditorUtility.OpenFilePanel( "Select map to upload", dir, "ilf" );

	        if( pathd.Length < 2 )
	                return;

	        var client : MyWebClient = new MyWebClient();
	        print( "Uploading..." );

	        uploadPath = pathd;

		 	// Also upload the Crc data about the level - blaze
			resetUploadUrl("upload");
		 	var crc : uint = 0;
		 	var crcPrefKey = "ExportLevel.crc." + uploadPath;
		 	if (PlayerPrefs.HasKey(crcPrefKey))
		 	{
		 		crc = PlayerPrefs.GetInt(crcPrefKey);
		 		uploadUrl += "&crc=" + crc;
		 	}
		 	// UnityEngine.Debug.Log("crc: " + crc);
			//UnityEngine.Debug.Log(uploadUrl);

	        //thread the upload so that it does not hang the editor
	        var thread = System.Threading.Thread(UploadFile);
	     	thread.Start();

	     	// EditorUtility.DisplayProgressBar("Publish", "Uploading current version...", 0.9);
	     	// EditorUtility.ClearProgressBar();
	       	}
	       	else
	       	{
	       		print("Still uploading other file... please wait."); 
	       	}
       }

}

static function ValidateTrue()
{
	return true;
}
static function UploadFile()
{
	uploading = true;
	var client : MyWebClient = new MyWebClient();
 
	var aa : System.Uri = new System.Uri(uploadUrl);

    ServicePointManager.SecurityProtocol = SecurityProtocolType.Ssl3 ;
    ServicePointManager.ServerCertificateValidationCallback = ValidateTrue;
	// client.UploadProgressChanged += new UploadProgressChangedEventHandler(client.UploadFileCallback);

	var result = client.UploadFile( aa, uploadPath );
	var resultText = Encoding.UTF8.GetString(result);

	print(resultText);
	print( "Upload complete!" );
	uploading = false;

}

static function resetUploadUrl(source : String)
{
	uploadUrl = defaultUploadUrl;
	var secretHash = "su444FDDd3s2243tge5tbRTFFgherq";
	var username;
	var password;
	if (source == "window")
	{
		username = LoginWindow.username;
		password = LoginWindow.password;
	} else {
		username = PlayerPrefs.GetString("ExportLevel.username");
		password = PlayerPrefs.GetString("ExportLevel.password");
	}
	var unityHash = Md5Sum(password + secretHash + username + "420");
	uploadUrl += "?nickforum=" + WWW.EscapeURL(username) + "&passforum=" + WWW.EscapeURL(password) + "&myform_hash=" + unityHash;
}

static function TryLogin()
{
	PlayerPrefs.SetInt("ExportLevel.validUnPw", 0);
	LoginWindow.loginStatusText = "Testing login credentials...";
	resetUploadUrl("window");	
	//UnityEngine.Debug.Log(uploadUrl);
	
	var client : MyWebClient = new MyWebClient(); 
	var aa : System.Uri = new System.Uri(uploadUrl);

    ServicePointManager.SecurityProtocol = SecurityProtocolType.Ssl3 ;
    ServicePointManager.ServerCertificateValidationCallback = ValidateTrue;
	//client.UploadFile( aa, uploadPath );
	// var response = client.GetWebRequest(aa);

	try {
	    var pageContent = client.DownloadString(aa);
	}
	catch (ex)
	{
	    var receiveStream : System.IO.Stream = ex.Response.GetResponseStream();
	    var encode = System.Text.Encoding.GetEncoding("utf-8");
	    var readStream = new System.IO.StreamReader( receiveStream, encode );
	    pageContent=readStream.ReadToEnd();
	}

	// UnityEngine.Debug.Log(pageContent);

	var responseSplit : String[] = pageContent.Split("/"[0]);
	if (responseSplit[0] != "Connected")
	{
		LoginWindow.loginStatusText = "Login error";
		PlayerPrefs.SetInt("ExportLevel.validUnPw", 0);
	}
	else
	{
		LoginWindow.loginStatusText = "Connected";
		PlayerPrefs.SetInt("ExportLevel.validUnPw", 1);
	}
	PlayerPrefs.Save();
}


class LoginWindow extends EditorWindow {
	static var username : String;
	static var password : String;
	static var loginStatusText : String = "";

	var window : LoginWindow;

	function Awake(){

	if (PlayerPrefs.HasKey("ExportLevel.username")) 
	{
		username = PlayerPrefs.GetString("ExportLevel.username");
	}

	if (PlayerPrefs.HasKey("ExportLevel.password")) 
	{
		password = PlayerPrefs.GetString("ExportLevel.password");
	}

	}
	function OnGUI () {
		GUILayout.Label ("Login credentials to upload levels", EditorStyles.boldLabel);
			username = EditorGUILayout.TextField ("Username", username);
			password = EditorGUILayout.PasswordField ("Password", password);

			GUILayout.Label (loginStatusText, EditorStyles.boldLabel);

			if(GUILayout.Button("Upload"))
			{

				PlayerPrefs.SetString("ExportLevel.username", username);
				PlayerPrefs.SetString("ExportLevel.password", password);
				PlayerPrefs.Save();
				this.Close();
				ExportLevel.Upload();
			}

			if(GUILayout.Button("Test Login"))
			{
				PlayerPrefs.Save();				
				ExportLevel.TryLogin();
			}

			if(GUILayout.Button("Close"))
			{
				PlayerPrefs.SetString("ExportLevel.username", username);
				PlayerPrefs.SetString("ExportLevel.password", password);
				PlayerPrefs.Save();
				this.Close();
			}
	}

}

// static function UploadFileCallback(sender : System.Object ,  e : UploadProgressChangedEventArgs)
// {
//     // Displays the operation identifier, and the transfer progress.
//     	print("asjhdajshgd");
//     	//print("    uploaded "+e.BytesSent+" of "+e.TotalBytesToSend+" bytes. "+e.ProgressPercentage+" % complete...");
// }

static function Md5Sum(strToEncrypt: String)
{
	var encoding = System.Text.UTF8Encoding();
	var bytes = encoding.GetBytes(strToEncrypt);
 
	// encrypt bytes
	var md5 = System.Security.Cryptography.MD5CryptoServiceProvider();
	var hashBytes:byte[] = md5.ComputeHash(bytes);
 
	// Convert the encrypted bytes back to a string (base 16)
	var hashString = "";
 
	for (var i = 0; i < hashBytes.Length; i++)
	{
		hashString += System.Convert.ToString(hashBytes[i], 16).PadLeft(2, "0"[0]);
	}
 
	return hashString.PadLeft(32, "0"[0]);
}
/***
static function Md5Sum(strToEncrypt : String) {
	var ue : System.Text.UTF8Encoding = new System.Text.UTF8Encoding();
	var bytes : byte[] = ue.GetBytes(strToEncrypt);

	// encrypt bytes
	var md5 : System.Security.Cryptography.MD5CryptoServiceProvider = new System.Security.Cryptography.MD5CryptoServiceProvider();
	var hashBytes : byte[] = md5.ComputeHash(bytes);

	// Convert the encrypted bytes back to a string (base 16)
	var hashString : String = "";

	for (var i = 0; i < hashBytes.Length; i++) {
	    hashString += System.Convert.ToString(hashBytes[i], 16).PadLeft(2, "0"[0]);
	}

	return hashString.PadLeft(32, "0"[0]);
}
***/