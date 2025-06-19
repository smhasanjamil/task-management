import prisma from "../../../lib/prisma"

//create a team
const createTeamIntoDB = async (payload: { teamName: string; members: string[] }) => {
    const { teamName, members } = payload;
    // console.log(teamName, members)

    // First verify all users exist and check if they're already assigned to a team
    for (const userId of members) {
        // Check if user exists
        const user = await prisma.user.findUnique({
            where: { userId },
            include: {
                teams: {
                    include: {
                        team: true
                    }
                }
            }
        });
        
        if (!user) {
            throw new Error(`User with userId ${userId} not found`);
        }

        // Check if user is already assigned to a team
        if (user.teams.length > 0) {
            const existingTeam = user.teams[0].team;
            throw new Error(`User ${user.userName} with userId ${userId} is already assigned to team: ${existingTeam.teamName}`);
        }
    }

    //create team
    const team = await prisma.team.create({
        data: {
            teamName,
        }
    });

    //add members to the team
    for (const userId of members) {
        await prisma.userAssignedTeam.create({
            data: {
                userId,
                teamId: team.id,
            }
        });
    }

    // ===Return the team with its members=====
    const result = await prisma.team.findUnique({
        where: { id: team.id },
        include: {
            members: {
                include: {
                    user: {
                        select: {
                            userId: true,
                            userName: true,
                            email: true,
                            role: true
                        }
                    }
                }
            }
        }
    });
    return result
}

//==================Get all Team ===============
const getAllTeamsFromDB = async () => {
    const result = await prisma.team.findMany({
        include: {
            members: {
                include: {
                    user: true
                }
            }
        }
    });
    return result;
}

//=============Get single Team ==============
const getSingleTeamFromDB = async (id: string) => {
    const result = await prisma.team.findUnique({
        where: { id },
        include: {
            members: {
                include: {
                    user: true
                }
            }
        }
    });
    if (!result) {
        throw new Error("Team not found")
    }

    return result;
}

//==================Delete a Team =================
const deleteTeamFromDB = async (id: string) => {
    //first delete all team assignment
    await prisma.userAssignedTeam.deleteMany({
        where: { teamId: id }
    });

    //now delete the team
    const result = await prisma.team.delete({
        where: { id }
    });
    return result;
};

//========Upsate a Team =========
const updateTeamInDB = async (id: string, payload: { teamName?: string; members?: string[]; removeMember?: string }) => {
    const { teamName, members, removeMember } = payload;

    // If removing a single member
    if (removeMember) {
        await prisma.userAssignedTeam.deleteMany({
            where: {
                teamId: id,
                userId: removeMember
            }
        });
    }
    // If updating the entire members list
    else if (members) {
        // Verify all users exist
        for (const userId of members) {
            const user = await prisma.user.findUnique({
                where: { userId }
            });
            if (!user) {
                throw new Error(`User with userId ${userId} not found`);
            }
        }

        // Delete existing team assignments
        await prisma.userAssignedTeam.deleteMany({
            where: { teamId: id }
        });

        // Create new team assignments
        for (const userId of members) {
            await prisma.userAssignedTeam.create({
                data: {
                    userId,
                    teamId: id,
                }
            });
        }
    }

    // Update team name if provided
    if (teamName) {
        await prisma.team.update({
            where: { id },
            data: { teamName }
        });
    }

    // Return updated team with members
    const result = await prisma.team.findUnique({
        where: { id },
        include: {
            members: {
                include: {
                    user: true
                }
            }
        }
    })
}

export const teamService = {
    createTeamIntoDB,
    deleteTeamFromDB,
    getAllTeamsFromDB,
    updateTeamInDB,
    getSingleTeamFromDB
}
