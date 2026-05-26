#!/usr/bin/env node

/**
 * Setup script to validate environment and project configuration
 */

const fs = require('fs')
const path = require('path')
const crypto = require('crypto')

const colors = {
    red: '\x1b[31m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    reset: '\x1b[0m',
    bold: '\x1b[1m',
}

function log(message, color = colors.reset) {
    console.log(`${color}${message}${colors.reset}`)
}

function generateSecret(length = 32) {
    return crypto.randomBytes(length).toString('base64')
}

function checkEnvironmentFile() {
    const envExamplePath = path.join(process.cwd(), '.env.example')
    const envLocalPath = path.join(process.cwd(), '.env.local')

    if (!fs.existsSync(envLocalPath)) {
        log('❌ .env.local file not found', colors.red)
        log('📝 Creating .env.local from .env.example...', colors.yellow)

        if (fs.existsSync(envExamplePath)) {
            let envContent = fs.readFileSync(envExamplePath, 'utf8')

            // Generate secrets
            const authSecret = generateSecret()
            const jwtSecret = generateSecret()
            const internalApiSecret = generateSecret()
            const encryptionKey = generateSecret(32).substring(0, 32)

            // Replace placeholders
            envContent = envContent
                .replace('your-nextauth-secret-key-here', authSecret)
                .replace('your-jwt-secret-key-32-chars-minimum', jwtSecret)
                .replace(
                    'your-super-secret-internal-api-key-32-chars-min',
                    internalApiSecret,
                )
                .replace('your-32-character-encryption-key-here', encryptionKey)

            fs.writeFileSync(envLocalPath, envContent)
            log('✅ .env.local created with generated secrets', colors.green)
            log(
                '⚠️  Please update the API URLs and OAuth credentials',
                colors.yellow,
            )
        } else {
            log('❌ .env.example file not found', colors.red)
            return false
        }
    } else {
        log('✅ .env.local file exists', colors.green)
    }

    return true
}

function checkRequiredDependencies() {
    const packageJsonPath = path.join(process.cwd(), 'package.json')

    if (!fs.existsSync(packageJsonPath)) {
        log('❌ package.json not found', colors.red)
        return false
    }

    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'))

    log('✅ Project dependencies checked', colors.green)
    log(`📦 Project: ${packageJson.name} v${packageJson.version}`, colors.blue)

    return true
}

function checkTypeScriptConfig() {
    const tsconfigPath = path.join(process.cwd(), 'tsconfig.json')

    if (!fs.existsSync(tsconfigPath)) {
        log('❌ tsconfig.json not found', colors.red)
        return false
    }

    const tsconfig = JSON.parse(fs.readFileSync(tsconfigPath, 'utf8'))

    if (tsconfig.compilerOptions.strict !== true) {
        log('⚠️  TypeScript strict mode is disabled', colors.yellow)
        log(
            '   Consider enabling strict mode for better type safety',
            colors.yellow,
        )
    } else {
        log('✅ TypeScript strict mode enabled', colors.green)
    }

    return true
}

function printSetupInstructions() {
    log('\n' + '='.repeat(60), colors.blue)
    log('🚀 MKT-Next Setup Complete!', colors.bold + colors.green)
    log('='.repeat(60), colors.blue)

    log('\n📋 Next Steps:', colors.bold)
    log('1. Update .env.local with your actual API URLs')
    log('2. Configure OAuth providers (optional)')
    log('3. Set up your backend API')
    log('4. Run: npm run dev')

    log('\n🔧 Development Commands:', colors.bold)
    log('• npm run dev          - Start development server')
    log('• npm run build        - Build for production')
    log('• npm run type-check   - Check TypeScript types')
    log('• npm run lint         - Lint code')
    log('• npm run prettier     - Format code')

    log('\n📚 Documentation:', colors.bold)
    log('• README.md            - Project overview')
    log('• SECURITY.md          - Security features')
    log('• .env.example         - Environment variables')

    log('\n' + '='.repeat(60), colors.blue)
}

function main() {
    log('🔧 Setting up MKT-Next project...', colors.bold + colors.blue)
    log('')

    let success = true

    // Check package.json
    if (!checkRequiredDependencies()) {
        success = false
    }

    // Check TypeScript config
    if (!checkTypeScriptConfig()) {
        success = false
    }

    // Check environment file
    if (!checkEnvironmentFile()) {
        success = false
    }

    if (success) {
        printSetupInstructions()
    } else {
        log('\n❌ Setup failed. Please fix the errors above.', colors.red)
        process.exit(1)
    }
}

if (require.main === module) {
    main()
}
