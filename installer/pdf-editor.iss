; ============================================================
; PDF Editor — script Inno Setup
;
; Ouvrir ce fichier dans Inno Setup Compiler (ISCC) puis cliquer sur
; "Compile". Le setup.exe est généré dans installer\output\.
;
; Pré-requis avant compilation :
;   1. Avoir lancé build-windows.bat à la racine du projet :
;      celui-ci produit dist\PDF-Editor\PDF-Editor.exe + dépendances
;   2. (Optionnel) Pour embarquer Ghostscript : copiez votre dossier
;      d'installation Ghostscript dans installer\ghostscript\
;      puis renommez `bin\gswin64c.exe` en `bin\gs.exe`,
;      et décommentez la ligne Ghostscript dans la section [Files].
; ============================================================

#define MyAppName "PDF Editor"
#define MyAppVersion "1.0.0"
#define MyAppPublisher "Theo Meurier"
#define MyAppURL "https://github.com/theomeurr/PDF-Editor"
#define MyAppExeName "PDF-Editor.exe"

[Setup]
; AppId unique — ne le changez plus jamais (utilisé par le désinstalleur)
AppId={{8F4A6E0C-1B7A-4D29-9A8C-F1C5E3B27E11}
AppName={#MyAppName}
AppVersion={#MyAppVersion}
AppVerName={#MyAppName} {#MyAppVersion}
AppPublisher={#MyAppPublisher}
AppPublisherURL={#MyAppURL}
AppSupportURL={#MyAppURL}
AppUpdatesURL={#MyAppURL}/releases

DefaultDirName={autopf}\{#MyAppName}
DefaultGroupName={#MyAppName}
DisableProgramGroupPage=yes
DisableDirPage=no
UninstallDisplayIcon={app}\{#MyAppExeName}
UninstallDisplayName={#MyAppName}

; Installation utilisateur OU machine (l'installeur demande lequel)
PrivilegesRequired=lowest
PrivilegesRequiredOverridesAllowed=dialog

; 64-bit
ArchitecturesAllowed=x64compatible
ArchitecturesInstallIn64BitMode=x64compatible

; Sortie
OutputDir=output
OutputBaseFilename=PDF-Editor-Setup-{#MyAppVersion}
Compression=lzma2/ultra64
SolidCompression=yes
LZMAUseSeparateProcess=yes

WizardStyle=modern
#if FileExists(AddBackslash(SourcePath) + "icon.ico")
SetupIconFile=icon.ico
#endif

[Languages]
Name: "french"; MessagesFile: "compiler:Languages\French.isl"
Name: "english"; MessagesFile: "compiler:Default.isl"

[Tasks]
Name: "desktopicon"; Description: "{cm:CreateDesktopIcon}"; GroupDescription: "{cm:AdditionalIcons}"; Flags: unchecked

[Files]
; Tout le bundle PyInstaller (dist\PDF-Editor\)
Source: "..\dist\PDF-Editor\*"; DestDir: "{app}"; Flags: ignoreversion recursesubdirs createallsubdirs

; Optionnel : Ghostscript portable embarqué
; Source: "ghostscript\*"; DestDir: "{app}\ghostscript"; Flags: ignoreversion recursesubdirs createallsubdirs

; Documentation
Source: "..\README.md";  DestDir: "{app}"; Flags: ignoreversion
Source: "..\WINDOWS.md"; DestDir: "{app}"; Flags: ignoreversion

[Icons]
Name: "{group}\{#MyAppName}";                              Filename: "{app}\{#MyAppExeName}"
Name: "{group}\{cm:UninstallProgram,{#MyAppName}}";        Filename: "{uninstallexe}"
Name: "{autodesktop}\{#MyAppName}";                        Filename: "{app}\{#MyAppExeName}"; Tasks: desktopicon

[Run]
Filename: "{app}\{#MyAppExeName}"; Description: "{cm:LaunchProgram,{#StringChange(MyAppName, '&', '&&')}}"; Flags: nowait postinstall skipifsilent

[UninstallDelete]
Type: filesandordirs; Name: "{localappdata}\PDF-Editor"

[Code]
function InitializeSetup(): Boolean;
var
  GsPath: String;
begin
  Result := True;

  // Détecte Ghostscript installé. Si absent, prévient l'utilisateur mais autorise l'installation.
  if not RegQueryStringValue(HKLM, 'SOFTWARE\GPL Ghostscript', '', GsPath)
     and not RegQueryStringValue(HKLM, 'SOFTWARE\WOW6432Node\GPL Ghostscript', '', GsPath)
     and not FileExists(ExpandConstant('{src}\ghostscript\bin\gs.exe')) then
  begin
    if MsgBox(
      'Ghostscript n''a pas été détecté sur ce PC.' + #13#10 + #13#10 +
      'PDF Editor en a besoin pour la fonction de compression PDF.' + #13#10 +
      'La fusion fonctionnera quand même.' + #13#10 + #13#10 +
      'Vous pouvez télécharger Ghostscript ici :' + #13#10 +
      'https://ghostscript.com/releases/gsdnld.html' + #13#10 + #13#10 +
      'Continuer l''installation quand même ?',
      mbConfirmation, MB_YESNO) = IDNO then
    begin
      Result := False;
    end;
  end;
end;
