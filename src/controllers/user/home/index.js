import HomescreenSettings from 'homescreenSettings';
import * as userSettings from 'userSettings';
import autoFocuser from 'autoFocuser';
import 'listViewStyle';

// Shortcuts
const UserSettings = userSettings.UserSettings;

export default function (view, params) {
    function onBeforeUnload(e) {
        if (hasChanges) {
            e.returnValue = 'You currently have unsaved changes. Are you sure you wish to leave?';
        }
    }

    let homescreenSettingsInstance;
    let hasChanges;
    const userId = params.userId || ApiClient.getCurrentUserId();
    const currentSettings = userId === ApiClient.getCurrentUserId() ? userSettings : new UserSettings();
    view.addEventListener('viewshow', function () {
        window.addEventListener('beforeunload', onBeforeUnload);

        if (homescreenSettingsInstance) {
            homescreenSettingsInstance.loadData();
        } else {
            homescreenSettingsInstance = new HomescreenSettings({
                serverId: ApiClient.serverId(),
                userId: userId,
                element: view.querySelector('.homeScreenSettingsContainer'),
                userSettings: currentSettings,
                enableSaveButton: true,
                enableSaveConfirmation: true,
                autoFocus: autoFocuser.isEnabled()
            });
        }
    });

    view.addEventListener('change', function () {
        hasChanges = true;
    });

    view.addEventListener('viewdestroy', function () {
        if (homescreenSettingsInstance) {
            homescreenSettingsInstance.destroy();
            homescreenSettingsInstance = null;
        }
    });
}
