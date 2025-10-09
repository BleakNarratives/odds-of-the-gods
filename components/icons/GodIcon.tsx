import React from 'react';
import { GodId } from '../../types';
import * as MythicIcons from './MythicIcons';

interface GodIconProps extends React.SVGProps<SVGSVGElement> {
    godId: GodId;
}

const GodIcon: React.FC<GodIconProps> = ({ godId, ...props }) => {
    const iconMap: Record<GodId, React.FC<React.SVGProps<SVGSVGElement>>> = {
        zeus: MythicIcons.ZeusIcon,
        hades: MythicIcons.HadesIcon,
        loki: MythicIcons.LokiIcon,
        fortuna: MythicIcons.FortunaIcon,
        anubis: MythicIcons.AnubisIcon,
        thoth: MythicIcons.ThothIcon,
        janus: MythicIcons.JanusIcon,
        hecate: MythicIcons.HecateIcon,
        morrigan: MythicIcons.MorriganIcon,
        aspirant: MythicIcons.AspirantIcon,
        user_god: MythicIcons.AspirantIcon, // Fallback for user god
    };

    const IconComponent = iconMap[godId] || MythicIcons.AspirantIcon;

    return <IconComponent {...props} />;
};

export default GodIcon;
